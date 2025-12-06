package servlet;

import dao.RecipeDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Recipe;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SearchServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final RecipeDAO recipeDAO = new RecipeDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String query = req.getParameter("q");
        
        if (query == null || query.trim().isEmpty()) {
            sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Search query is required");
            return;
        }
        
        List<Recipe> recipes = recipeDAO.searchRecipes(query.trim());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("recipes", recipes);
        sendJsonResponse(resp, response);
    }
}


