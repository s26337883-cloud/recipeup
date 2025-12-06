package servlet;

import dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class UserServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (!requireAuth(req, resp)) {
            return;
        }
        
        String path = req.getPathInfo();
        
        if (path != null && path.equals("/profile")) {
            handleGetProfile(req, resp);
        } else if (path != null && path.equals("/dashboard")) {
            handleGetDashboard(req, resp);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
        }
    }
    
    private void handleGetProfile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = getAuthenticatedUser(req);
        if (user != null) {
            sendJsonResponse(resp, user);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_UNAUTHORIZED, "Not authenticated");
        }
    }
    
    private void handleGetDashboard(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = getAuthenticatedUser(req);
        if (user == null) {
            sendErrorResponse(resp, HttpServletResponse.SC_UNAUTHORIZED, "Not authenticated");
            return;
        }
        
        // Get user stats (simplified - you can enhance this with actual counts)
        Map<String, Object> stats = new HashMap<>();
        stats.put("recipeCount", 0); // TODO: Implement count methods in DAOs
        stats.put("commentCount", 0);
        stats.put("lastActivity", "N/A");
        
        sendJsonResponse(resp, stats);
    }
}


