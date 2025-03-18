-- 清除现有权限数据
DELETE FROM tb_permissions;

-- 添加管理员权限（拥有所有权限）
INSERT INTO tb_permissions (id, role_type, 
    prod_view, prod_create, prod_edit, prod_delete,
    spec_view, spec_create, spec_edit, spec_delete,
    quote_view, quote_create, quote_edit, quote_delete,
    settings_users, settings_permissions)
VALUES ('admin_perm_001', 0, 
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1);

-- 添加供应商权限（只能创建和查看自己的报价单和规格表）
INSERT INTO tb_permissions (id, role_type, 
    prod_view, prod_create, prod_edit, prod_delete,
    spec_view, spec_create, spec_edit, spec_delete,
    quote_view, quote_create, quote_edit, quote_delete,
    settings_users, settings_permissions)
VALUES ('supplier_perm_001', 1, 
    1, 1, 0, 0,
    0, 0, 0, 0,
    1, 1, 0, 0,
    0, 0);

-- 添加员工权限（可以创建规格表和质检表，查看所有数据，可以编辑和删除）
INSERT INTO tb_permissions (id, role_type, 
    prod_view, prod_create, prod_edit, prod_delete,
    spec_view, spec_create, spec_edit, spec_delete,
    quote_view, quote_create, quote_edit, quote_delete,
    settings_users, settings_permissions)
VALUES ('employee_perm_001', 2, 
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 0, 1, 1,
    0, 0); 