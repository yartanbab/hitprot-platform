import { describe, it, expect, afterEach } from 'vitest';
import { getTaskPermissions } from './taskPermissions';

/* Sunucudaki EnsureCanMutateTaskAsync ile aynı kural: uç izni + (oluşturan | atanan |
   Projects.ManageTeam). Kök ve alt görev paneli aynı yardımcıyı kullanır. */
function setUser(id, granted) {
    window.abp = { currentUser: { id }, auth: { isGranted: (p) => granted.includes(p) } };
}

const ALL_TASK = ['Platform.Tasks.Edit', 'Platform.Tasks.ChangeStatus', 'Platform.Tasks.Delete'];

afterEach(() => { delete window.abp; });

describe('getTaskPermissions', () => {
    it('olusturan uc izinleriyle duzenler, durum degistirir, siler', () => {
        setUser('u-1', ALL_TASK);
        expect(getTaskPermissions({ creatorId: 'u-1' })).toEqual({
            canManage: true, canEdit: true, canChangeStatus: true, canDelete: true,
        });
    });

    it('atanan da sahip sayilir', () => {
        setUser('u-1', ALL_TASK);
        expect(getTaskPermissions({ creatorId: 'u-2', assigneeId: 'u-1' }).canEdit).toBe(true);
    });

    it('sahibi olmayan ve ekip yoneticisi olmayan hicbir yazma eylemi alamaz', () => {
        setUser('u-9', ALL_TASK);
        expect(getTaskPermissions({ creatorId: 'u-1', assigneeId: 'u-2' })).toEqual({
            canManage: false, canEdit: false, canChangeStatus: false, canDelete: false,
        });
    });

    it('ekip yoneticisi sahibi olmadigi gorevi de yonetir', () => {
        setUser('u-9', [...ALL_TASK, 'Platform.Projects.ManageTeam']);
        expect(getTaskPermissions({ creatorId: 'u-1' }).canEdit).toBe(true);
    });

    it('sahiplik uc iznini ATLATMAZ: ChangeStatus varsa yalniz durum acik', () => {
        setUser('u-1', ['Platform.Tasks.ChangeStatus']);
        expect(getTaskPermissions({ creatorId: 'u-1' })).toEqual({
            canManage: true, canEdit: false, canChangeStatus: true, canDelete: false,
        });
    });

    it('oturum kimligi yoksa bos creatorId esitlenmez', () => {
        window.abp = { auth: { isGranted: () => false } };
        expect(getTaskPermissions({ creatorId: undefined }).canManage).toBe(false);
    });
});
