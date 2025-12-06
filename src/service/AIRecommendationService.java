package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

public class AIRecommendationService {
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private String apiKey;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIRecommendationService() {
        // Load API key from environment variable (highest priority)
        apiKey = System.getenv("OPENAI_API_KEY");
        
        // If not in environment, try system property
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getProperty("OPENAI_API_KEY", "");
        }
        
        // If still not found, try to load from config.properties
        if (apiKey == null || apiKey.isEmpty()) {
            try {
                Properties props = new Properties();
                String configPath = System.getProperty("user.dir") + "/config.properties";
                try (FileInputStream fis = new FileInputStream(configPath)) {
                    props.load(fis);
                    apiKey = props.getProperty("OPENAI_API_KEY", "");
                }
            } catch (Exception e) {
                // Config file not found, that's okay
                System.out.println("Config file not found, using environment variables or mock recipes");
            }
        }
        
        // Default API key for this project (if provided)
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = "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";
        }
    }

    public List<Map<String, String>> generateRecipes(List<String> ingredients) {
        if (apiKey == null || apiKey.isEmpty()) {
            // Return mock recipes if API key is not configured
            return generateMockRecipes(ingredients);
        }

        try {
            String prompt = buildPrompt(ingredients);
            String response = callOpenAI(prompt);
            return parseResponse(response);
        } catch (Exception e) {
            System.err.println("Error calling OpenAI API: " + e.getMessage());
            e.printStackTrace();
            // Fallback to mock recipes
            return generateMockRecipes(ingredients);
        }
    }

    private String buildPrompt(List<String> ingredients) {
        String ingredientsList = String.join(", ", ingredients);
        return "Generate 2-3 creative and delicious recipes using these ingredients: " + ingredientsList + 
               ". For each recipe, provide:\n" +
               "1. A creative title\n" +
               "2. A brief description\n" +
               "3. List of ingredients (including the provided ones)\n" +
               "4. Step-by-step cooking instructions\n\n" +
               "Format the response as JSON array with objects containing: title, description, ingredients, steps.";
    }

    private String callOpenAI(String prompt) throws Exception {
        URL url = new URL(OPENAI_API_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);

        String requestBody = "{\n" +
            "  \"model\": \"gpt-3.5-turbo\",\n" +
            "  \"messages\": [\n" +
            "    {\n" +
            "      \"role\": \"user\",\n" +
            "      \"content\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"temperature\": 0.7,\n" +
            "  \"max_tokens\": 1000\n" +
            "}";

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new Exception("OpenAI API returned error: " + responseCode);
        }

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            return br.lines().collect(Collectors.joining("\n"));
        }
    }

    private List<Map<String, String>> parseResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode choices = rootNode.path("choices");
            
            if (!choices.isArray() || choices.size() == 0) {
                return generateMockRecipes(new ArrayList<>());
            }
            
            // Get the first choice's message content
            String content = choices.get(0).path("message").path("content").asText();
            
            // Try to parse the content as JSON array
            if (content.trim().startsWith("[")) {
                JsonNode recipesArray = objectMapper.readTree(content);
                List<Map<String, String>> recipes = new ArrayList<>();
                
                for (JsonNode recipeNode : recipesArray) {
                    Map<String, String> recipe = new HashMap<>();
                    recipe.put("title", recipeNode.path("title").asText("Untitled Recipe"));
                    recipe.put("description", recipeNode.path("description").asText(""));
                    recipe.put("ingredients", recipeNode.path("ingredients").asText(""));
                    recipe.put("steps", recipeNode.path("steps").asText(""));
                    recipes.add(recipe);
                }
                
                if (!recipes.isEmpty()) {
                    return recipes;
                }
            }
            
            // If JSON parsing fails, try to extract recipes from text
            return parseTextResponse(content);
            
        } catch (Exception e) {
            System.err.println("Error parsing OpenAI response: " + e.getMessage());
            e.printStackTrace();
            // Fallback to mock recipes
            return generateMockRecipes(new ArrayList<>());
        }
    }
    
    private List<Map<String, String>> parseTextResponse(String content) {
        // Simple text parsing as fallback
        // This is a basic implementation - you might want to improve it
        List<Map<String, String>> recipes = new ArrayList<>();
        
        // Try to extract recipe information from text
        String[] sections = content.split("Recipe|recipe");
        for (String section : sections) {
            if (section.trim().length() > 50) {
                Map<String, String> recipe = new HashMap<>();
                String[] lines = section.split("\n");
                if (lines.length > 0) {
                    recipe.put("title", lines[0].trim());
                    recipe.put("description", section.substring(0, Math.min(200, section.length())));
                    recipe.put("ingredients", extractSection(section, "ingredients", "steps"));
                    recipe.put("steps", extractSection(section, "steps", ""));
                    recipes.add(recipe);
                }
            }
        }
        
        return recipes.isEmpty() ? generateMockRecipes(new ArrayList<>()) : recipes;
    }
    
    private String extractSection(String text, String startKeyword, String endKeyword) {
        int startIdx = text.toLowerCase().indexOf(startKeyword.toLowerCase());
        if (startIdx == -1) return "";
        
        int endIdx = endKeyword.isEmpty() ? text.length() : text.toLowerCase().indexOf(endKeyword.toLowerCase(), startIdx + startKeyword.length());
        if (endIdx == -1) endIdx = text.length();
        
        return text.substring(startIdx + startKeyword.length(), endIdx).trim();
    }

    private List<Map<String, String>> generateMockRecipes(List<String> ingredients) {
        List<Map<String, String>> recipes = new ArrayList<>();
        
        String ingredientsList = String.join(", ", ingredients);
        
        Map<String, String> recipe1 = new HashMap<>();
        recipe1.put("title", "Creative " + (ingredients.isEmpty() ? "Dish" : ingredients.get(0)) + " Recipe");
        recipe1.put("description", "A delicious recipe using " + (ingredientsList.isEmpty() ? "available ingredients" : ingredientsList));
        recipe1.put("ingredients", ingredientsList + ", salt, pepper, olive oil");
        recipe1.put("steps", "1. Prepare all ingredients\n2. Heat a pan with olive oil\n3. Add ingredients and cook until done\n4. Season with salt and pepper\n5. Serve hot");
        recipes.add(recipe1);

        if (ingredients.size() > 1) {
            Map<String, String> recipe2 = new HashMap<>();
            recipe2.put("title", "Gourmet " + ingredients.get(0) + " and " + ingredients.get(1) + " Delight");
            recipe2.put("description", "An elegant dish combining " + ingredients.get(0) + " and " + ingredients.get(1));
            recipe2.put("ingredients", ingredientsList + ", garlic, herbs, butter");
            recipe2.put("steps", "1. Mince garlic and prepare herbs\n2. Melt butter in a pan\n3. Add ingredients and sauté\n4. Add herbs and cook until fragrant\n5. Plate and garnish");
            recipes.add(recipe2);
        }

        return recipes;
    }
}

