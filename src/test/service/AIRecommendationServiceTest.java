package test.service;

import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class AIRecommendationServiceTest {
    private final AIRecommendationService aiService = new AIRecommendationService();

    @Test
    public void testGenerateRecipesWithMockData() {
        List<String> ingredients = Arrays.asList("tomato", "pasta", "garlic");
        List<Map<String, String>> recipes = aiService.generateRecipes(ingredients);
        
        assertNotNull(recipes);
        assertFalse(recipes.isEmpty());
        
        Map<String, String> firstRecipe = recipes.get(0);
        assertTrue(firstRecipe.containsKey("title"));
        assertTrue(firstRecipe.containsKey("description"));
        assertTrue(firstRecipe.containsKey("ingredients"));
        assertTrue(firstRecipe.containsKey("steps"));
    }

    @Test
    public void testGenerateRecipesWithEmptyList() {
        List<String> ingredients = Arrays.asList();
        List<Map<String, String>> recipes = aiService.generateRecipes(ingredients);
        
        assertNotNull(recipes);
        // Should return mock recipes even with empty list
        assertFalse(recipes.isEmpty());
    }
}

