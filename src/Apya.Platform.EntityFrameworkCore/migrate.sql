SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

DELETE FROM [AbpPermissionGrants] WHERE [ProviderName] = 'R' AND [ProviderKey] = 'admin';

INSERT INTO [AbpPermissionGrants] ([Id], [Name], [ProviderName], [ProviderKey])
VALUES 
(NEWID(), 'Platform.Projects', 'R', 'admin'),
(NEWID(), 'Platform.Projects.Create', 'R', 'admin'),
(NEWID(), 'Platform.Projects.Edit', 'R', 'admin'),
(NEWID(), 'Platform.Projects.Delete', 'R', 'admin'),
(NEWID(), 'Platform.Projects.ViewBudget', 'R', 'admin'),
(NEWID(), 'Platform.Projects.ManageTeam', 'R', 'admin'),
(NEWID(), 'Platform.Tasks', 'R', 'admin'),
(NEWID(), 'Platform.Tasks.Create', 'R', 'admin'),
(NEWID(), 'Platform.Tasks.Edit', 'R', 'admin'),
(NEWID(), 'Platform.Tasks.Delete', 'R', 'admin'),
(NEWID(), 'Platform.Tasks.Assign', 'R', 'admin'),
(NEWID(), 'Platform.Tasks.ChangeStatus', 'R', 'admin'),
(NEWID(), 'Platform.Documents', 'R', 'admin'),
(NEWID(), 'Platform.Documents.Create', 'R', 'admin'),
(NEWID(), 'Platform.Documents.Edit', 'R', 'admin'),
(NEWID(), 'Platform.Documents.Delete', 'R', 'admin'),
(NEWID(), 'Platform.Notifications', 'R', 'admin'),
(NEWID(), 'Platform.Notifications.MarkRead', 'R', 'admin'),
(NEWID(), 'Platform.Notifications.Delete', 'R', 'admin'),
(NEWID(), 'Platform.Calendars', 'R', 'admin'),
(NEWID(), 'Platform.Calendars.Connect', 'R', 'admin'),
(NEWID(), 'AbpPermissionManagement.Update', 'R', 'admin'),
(NEWID(), 'AbpIdentity.Roles.ManagePermissions', 'R', 'admin'),
(NEWID(), 'AbpIdentity.Users.ManagePermissions', 'R', 'admin'),
(NEWID(), 'AbpIdentity.Roles', 'R', 'admin'),
(NEWID(), 'AbpIdentity.Users', 'R', 'admin');
GO
