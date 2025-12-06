package dao;

import model.Recipe;
import model.User;
import util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RecipeDAO {
    public boolean addRecipe(Recipe recipe) {
        String sql = "INSERT INTO recipes (title, ingredients, steps, image, user_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, recipe.getTitle());
            stmt.setString(2, recipe.getIngredients());
            stmt.setString(3, recipe.getSteps());
            stmt.setString(4, recipe.getImage());
            stmt.setInt(5, recipe.getUserId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Recipe> getAllRecipes() {
        List<Recipe> recipes = new ArrayList<>();
        String sql = "SELECT r.id, r.title, r.ingredients, r.steps, r.image, r.user_id, r.created_at, u.name, u.email FROM recipes r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                recipes.add(mapRecipe(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recipes;
    }

    public Recipe getRecipeById(int id) {
        String sql = "SELECT r.id, r.title, r.ingredients, r.steps, r.image, r.user_id, r.created_at, u.name, u.email FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.id = ?";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRecipe(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Recipe> searchRecipes(String query) {
        List<Recipe> recipes = new ArrayList<>();
        String sql = "SELECT r.id, r.title, r.ingredients, r.steps, r.image, r.user_id, r.created_at, u.name, u.email " +
                     "FROM recipes r JOIN users u ON r.user_id = u.id " +
                     "WHERE r.title LIKE ? OR r.ingredients LIKE ? OR r.steps LIKE ? " +
                     "ORDER BY r.created_at DESC";
        try (Connection conn = DBConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            String searchPattern = "%" + query + "%";
            stmt.setString(1, searchPattern);
            stmt.setString(2, searchPattern);
            stmt.setString(3, searchPattern);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    recipes.add(mapRecipe(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recipes;
    }

    private Recipe mapRecipe(ResultSet rs) throws SQLException {
        Recipe recipe = new Recipe();
        recipe.setId(rs.getInt("id"));
        recipe.setTitle(rs.getString("title"));
        recipe.setIngredients(rs.getString("ingredients"));
        recipe.setSteps(rs.getString("steps"));
        recipe.setImage(rs.getString("image"));
        recipe.setUserId(rs.getInt("user_id"));
        if (rs.getTimestamp("created_at") != null) {
            recipe.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }

        User author = new User();
        author.setId(rs.getInt("user_id"));
        author.setName(rs.getString("name"));
        author.setEmail(rs.getString("email"));
        recipe.setAuthor(author);
        return recipe;
    }
}
