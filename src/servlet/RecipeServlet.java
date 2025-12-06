package servlet;

import dao.CommentDAO;
import dao.RecipeDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Comment;
import model.Recipe;
import model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RecipeServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final RecipeDAO recipeDAO = new RecipeDAO();
    private final CommentDAO commentDAO = new CommentDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        
        if (path == null || path.equals("/")) {
            // Get all recipes
            List<Recipe> recipes = recipeDAO.getAllRecipes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("recipes", recipes);
            sendJsonResponse(resp, response);
        } else if (path.matches("/\\d+")) {
            // Get recipe by ID
            int id = Integer.parseInt(path.substring(1));
            Recipe recipe = recipeDAO.getRecipeById(id);
            if (recipe != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("recipe", recipe);
                sendJsonResponse(resp, response);
            } else {
                sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Recipe not found");
            }
        } else if (path.matches("/\\d+/comments")) {
            // Get comments for recipe
            String[] parts = path.split("/");
            int recipeId = Integer.parseInt(parts[1]);
            List<Comment> comments = commentDAO.getCommentsByRecipeId(recipeId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("comments", comments);
            sendJsonResponse(resp, response);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        
        if (path == null || path.equals("/")) {
            // Create new recipe
            if (!requireAuth(req, resp)) {
                return;
            }
            handleCreateRecipe(req, resp);
        } else if (path.matches("/\\d+/comments")) {
            // Add comment to recipe
            if (!requireAuth(req, resp)) {
                return;
            }
            String[] parts = path.split("/");
            int recipeId = Integer.parseInt(parts[1]);
            handleAddComment(req, resp, recipeId);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
        }
    }
    
    private void handleCreateRecipe(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Map<String, String> body = objectMapper.readValue(req.getReader(), 
                objectMapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
            
            String title = body.get("title");
            String ingredients = body.get("ingredients");
            String steps = body.get("steps");
            String image = body.get("image");
            
            if (title == null || ingredients == null || steps == null || 
                title.trim().isEmpty() || ingredients.trim().isEmpty() || steps.trim().isEmpty()) {
                sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Title, ingredients, and steps are required");
                return;
            }
            
            User user = getAuthenticatedUser(req);
            Recipe recipe = new Recipe();
            recipe.setTitle(title.trim());
            recipe.setIngredients(ingredients.trim());
            recipe.setSteps(steps.trim());
            recipe.setImage(image != null && !image.trim().isEmpty() ? image.trim() : null);
            recipe.setUserId(user.getId());
            
            boolean success = recipeDAO.addRecipe(recipe);
            if (success) {
                sendJsonResponse(resp, new SuccessResponse(true, "Recipe created successfully", null));
            } else {
                sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create recipe");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create recipe");
        }
    }
    
    private void handleAddComment(HttpServletRequest req, HttpServletResponse resp, int recipeId) throws IOException {
        try {
            Map<String, String> body = objectMapper.readValue(req.getReader(), 
                objectMapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
            
            String commentText = body.get("comment");
            
            if (commentText == null || commentText.trim().isEmpty()) {
                sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Comment text is required");
                return;
            }
            
            User user = getAuthenticatedUser(req);
            Comment comment = new Comment();
            comment.setRecipeId(recipeId);
            comment.setUserId(user.getId());
            comment.setCommentText(commentText.trim());
            
            boolean success = commentDAO.addComment(comment);
            if (success) {
                sendJsonResponse(resp, new SuccessResponse(true, "Comment added successfully", null));
            } else {
                sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to add comment");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to add comment");
        }
    }
}

