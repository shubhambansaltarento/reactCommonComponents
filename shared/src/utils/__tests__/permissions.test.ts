import { Permission } from '../permissions';

describe('permissions', () => {
  describe('Permission enum', () => {
    it('should have VIEW_CLAIMS permission', () => {
      expect(Permission.VIEW_CLAIMS).toBe('view_claims');
    });

    it('should have CREATE_CLAIMS permission', () => {
      expect(Permission.CREATE_CLAIMS).toBe('create_claims');
    });

    it('should have REVIEW_CLAIMS permission', () => {
      expect(Permission.REVIEW_CLAIMS).toBe('review_claims');
    });

    it('should have exactly 3 permissions defined', () => {
      const permissionValues = Object.values(Permission);
      expect(permissionValues.length).toBe(3);
    });

    it('should have correct enum keys', () => {
      const permissionKeys = Object.keys(Permission);
      expect(permissionKeys).toContain('VIEW_CLAIMS');
      expect(permissionKeys).toContain('CREATE_CLAIMS');
      expect(permissionKeys).toContain('REVIEW_CLAIMS');
    });
  });
});
