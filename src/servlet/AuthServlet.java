package servlet;

import dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

public class AuthServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final UserDAO userDAO = new UserDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        
        if (path == null || path.equals("/")) {
            sendErrorResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid endpoint");
            return;
        }
        
        if (path.equals("/login")) {
            handleLogin(req, resp);
        } else if (path.equals("/register")) {
            handleRegister(req, resp);
        } else if (path.equals("/logout")) {
            handleLogout(req, resp);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        
        if (path != null && path.equals("/me")) {
            handleGetMe(req, resp);
        } else {
            sendErrorResponse(resp, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }
    
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Map<String, String> body = objectMapper.readValue(req.getReader(), 
                objectMapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
            
            String email = body.get("email");
            String password = body.get("password");
            
            if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
                sendJsonResponse(resp, new SuccessResponse(false, "Email and password are required", null));
                return;
            }
            
            User user = userDAO.authenticate(email.trim(), password);
            if (user != null) {
                HttpSession session = req.getSession(true);
                session.setAttribute("currentUser", user);
                sendJsonResponse(resp, new SuccessResponse(true, "Login successful", user));
            } else {
                sendJsonResponse(resp, new SuccessResponse(false, "Invalid credentials", null));
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Login failed");
        }
    }
    
    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Map<String, String> body = objectMapper.readValue(req.getReader(), 
                objectMapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
            
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");
            
            if (name == null || email == null || password == null || 
                name.trim().isEmpty() || email.trim().isEmpty() || password.trim().isEmpty()) {
                sendJsonResponse(resp, new SuccessResponse(false, "All fields are required", null));
                return;
            }
            
            if (userDAO.isEmailTaken(email)) {
                sendJsonResponse(resp, new SuccessResponse(false, "Email is already registered", null));
                return;
            }
            
            User user = new User(name.trim(), email.trim(), password);
            boolean success = userDAO.registerUser(user);
            if (success) {
                // Get the newly registered user
                User registeredUser = userDAO.authenticate(email.trim(), password);
                if (registeredUser != null) {
                    HttpSession session = req.getSession(true);
                    session.setAttribute("currentUser", registeredUser);
                    sendJsonResponse(resp, new SuccessResponse(true, "Registration successful", registeredUser));
                } else {
                    sendJsonResponse(resp, new SuccessResponse(false, "Registration successful but login failed", null));
                }
            } else {
                sendJsonResponse(resp, new SuccessResponse(false, "Unable to register. Please try again.", null));
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Registration failed");
        }
    }
    
    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        sendJsonResponse(resp, new SuccessResponse(true, "Logout successful", null));
    }
    
    private void handleGetMe(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = getAuthenticatedUser(req);
        if (user != null) {
            sendJsonResponse(resp, new SuccessResponse(true, "User found", user));
        } else {
            sendJsonResponse(resp, new SuccessResponse(false, "Not authenticated", null));
        }
    }
}


