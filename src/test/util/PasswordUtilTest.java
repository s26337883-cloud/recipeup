package test.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordUtilTest {
    @Test
    public void testHashPassword() {
        String password = "test123";
        String hash1 = PasswordUtil.hashPassword(password);
        String hash2 = PasswordUtil.hashPassword(password);
        
        assertNotNull(hash1);
        assertNotNull(hash2);
        assertEquals(hash1, hash2, "Same password should produce same hash");
        assertNotEquals(password, hash1, "Hash should be different from original password");
    }

    @Test
    public void testHashPasswordNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            PasswordUtil.hashPassword(null);
        });
    }

    @Test
    public void testHashPasswordDifferentPasswords() {
        String hash1 = PasswordUtil.hashPassword("password1");
        String hash2 = PasswordUtil.hashPassword("password2");
        
        assertNotEquals(hash1, hash2, "Different passwords should produce different hashes");
    }
}

