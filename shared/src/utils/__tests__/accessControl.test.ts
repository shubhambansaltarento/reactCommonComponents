import { hasPermission } from '../accessControl';
import { createMockPermissions } from './test-utils';

describe('accessControl', () => {
  describe('hasPermission', () => {
    const userPermissions = createMockPermissions();

    it('should return true when permission is empty string', () => {
      expect(hasPermission('', userPermissions)).toBe(true);
    });

    it('should return true when user has the permission', () => {
      expect(hasPermission('view_claims', userPermissions)).toBe(true);
    });

    it('should return true for another existing permission', () => {
      expect(hasPermission('create_claims', userPermissions)).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      expect(hasPermission('delete_claims', userPermissions)).toBe(false);
    });

    it('should return false for non-existent permission', () => {
      expect(hasPermission('admin_access', userPermissions)).toBe(false);
    });

    it('should return true for empty permission with empty user permissions', () => {
      expect(hasPermission('', [])).toBe(true);
    });

    it('should return false for any permission with empty user permissions', () => {
      expect(hasPermission('view_claims', [])).toBe(false);
    });
  });
});
