/**
 * Admin utility functions for MyMirro
 * Handles admin authentication and permissions
 */

// Admin users by email (can be moved to env or database later)
const ADMIN_EMAILS = [
  'admin@mymirro.com',
  'akhilendra.singh@mymirro.com',
  'akhisingh2211@gmail.com', // Add your admin email here
  // Add more admin emails as needed
];

// Admin secret key from environment
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'mymirro_admin_2024';

/**
 * Check if a user is an admin by email
 */
export function isAdminUser(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
}

/**
 * Check if the provided secret key is valid
 */
export function validateAdminSecret(providedKey: string): boolean {
  return providedKey === ADMIN_SECRET_KEY;
}

/**
 * Check if user has admin access (either by email or secret key)
 */
export function hasAdminAccess(userEmail: string | null | undefined, secretKey?: string): boolean {
  // Check by email first
  if (isAdminUser(userEmail)) {
    return true;
  }
  
  // Check by secret key if provided
  if (secretKey && validateAdminSecret(secretKey)) {
    return true;
  }
  
  return false;
}

/**
 * Check if user is admin without prompting (for UI rendering)
 */
export function isAdminForUI(userEmail: string | null | undefined): boolean {
  return isAdminUser(userEmail) || hasSessionAdminAccess();
}

/**
 * Prompt user for admin secret key
 */
export function promptForAdminAccess(): string | null {
  const secretKey = prompt('Enter admin secret key to access advanced features:');
  return secretKey;
}

/**
 * Check if advanced edit should be available for a user
 */
export function canAccessAdvancedEdit(userEmail: string | null | undefined): boolean {
  // First check if user is admin by email
  if (isAdminUser(userEmail)) {
    return true;
  }
  
  // If not admin by email, prompt for secret key
  const secretKey = promptForAdminAccess();
  if (secretKey && validateAdminSecret(secretKey)) {
    // Store in session storage for this session
    sessionStorage.setItem('admin_access', 'true');
    return true;
  }
  
  return false;
}

/**
 * Check if user has admin access from session storage
 */
export function hasSessionAdminAccess(): boolean {
  return sessionStorage.getItem('admin_access') === 'true';
}

/**
 * Clear admin access from session
 */
export function clearAdminAccess(): void {
  sessionStorage.removeItem('admin_access');
}