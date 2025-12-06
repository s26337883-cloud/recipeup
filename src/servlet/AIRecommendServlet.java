package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import service.AIRecommendationService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AIRecommendServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final AIRecommendationService aiService = new AIRecommendationService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Map<String, Object> body = objectMapper.readValue(req.getReader(), 
                objectMapper.getTypeFactory().constructMapType(Map.class, String.class, Object.class));
            
            @SuppressWarnings("unchecked")
            List<String> ingredients = (List<String>) body.get("ingredients");
            
            if (ingredients == null || ingredients.isEmpty()) {
                sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Ingredients list is required");
                return;
            }
            
            List<Map<String, String>> recipes = aiService.generateRecipes(ingredients);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("recipes", recipes);
            sendJsonResponse(resp, response);
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate recipes: " + e.getMessage());
        }
    }
}


