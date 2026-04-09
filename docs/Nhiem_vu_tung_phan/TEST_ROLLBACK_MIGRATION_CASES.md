# Test Rollback Migration Cases

## Muc dich

Tai lieu nay mo ta bo test rollback thu cong cho migration trong buoc 2, tap trung vao 4 tinh huong loi thuong gap:

- enum sai
- unique constraint sai
- relation sai
- them cot sai

Ap dung cho project hien tai:

- Backend: `ltwnc-shop/backend`
- Database: PostgreSQL trong Docker
- ORM: Prisma

## Nguyen tac test

- Chi test tren moi truong dev local.
- Luon backup neu can giu du lieu mau truoc khi thu.
- Khong test truc tiep tren production.
- Sau moi lan test, quay ve trang thai sach bang `prisma migrate reset` neu can.

## Lenh co ban dung trong tat ca test case

```powershell
cd c:\Users\PC\Documents\GitHub\LTWNC\ltwnc-shop\backend
$env:DATABASE_URL="postgresql://shopuser:shoppass@localhost:5432/shopdb?schema=public"
```

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate reset --force --skip-seed
npx prisma migrate status
```

Neu PowerShell chan `npx`:

```powershell
& "C:\Program Files\nodejs\npx.cmd" prisma validate
& "C:\Program Files\nodejs\npx.cmd" prisma generate
& "C:\Program Files\nodejs\npx.cmd" prisma migrate reset --force --skip-seed
& "C:\Program Files\nodejs\npx.cmd" prisma migrate status
```

---

## Case 1. Enum sai

### Muc tieu

Kiem tra migration/ schema co the phat hien loi khi enum thay doi sai quy tac.

### Cach tao loi

1. Mo `ltwnc-shop/backend/prisma/schema.prisma`.
2. Tam thoi doi `OrderStatus` hoac `UserRole` sai so voi gia tri dang dung.
   - Vi du: xoa `CONFIRMED` khoi `OrderStatus` trong khi DB dang co record dung gia tri nay.
3. Chay:

```powershell
npx prisma migrate dev --name test_enum_error
```

### Ky vong loi

- Prisma bao loi khi generate migration hoac khi apply migration.
- Neu DB dang co du lieu cu phu thuoc vao enum cu, migration se bi canh bao/that bai.

### Cach rollback

```powershell
npx prisma migrate reset --force --skip-seed
```

### Tieu chi pass

- Loi enum duoc phat hien truoc khi merge.
- DB local co the reset ve trang thai sach.
- Khong lam hu data mau khac ngoai pham vi dev.

---

## Case 2. Unique constraint sai

### Muc tieu

Kiem tra he thong khi them unique constraint moi co bi conflict voi du lieu hien co khong.

### Cach tao loi

1. Tam thoi them unique voi cot co du lieu trung lap.
   - Vi du: them `@@unique([name])` vao `Product` neu du lieu mau co the trung.
2. Hoac tao migration them unique constraint tren cot dang co duplicate.
3. Chay:

```powershell
npx prisma migrate dev --name test_unique_error
```

### Ky vong loi

- Prisma/PostgreSQL bao loi vi du lieu trung lap.
- Migration khong apply duoc neu duplicate data ton tai.

### Cach rollback

```powershell
npx prisma migrate resolve --rolled-back "<ten_migration_loi>"
npx prisma migrate reset --force --skip-seed
```

### Tieu chi pass

- Migration loi duoc phat hien som.
- Co the quay ve trang thai truoc do ma khong mat control schema.

---

## Case 3. Relation sai

### Muc tieu

Kiem tra loi khi quan he FK / onDelete / references cau hinh sai.

### Cach tao loi

1. Tam thoi doi relation trong schema.
   - Vi du: doi `references: [id]` thanh truong khong ton tai.
   - Hoac doi `onDelete` sang gia tri khong hop le cho nghiep vu.
2. Chay:

```powershell
npx prisma migrate dev --name test_relation_error
```

### Ky vong loi

- Prisma validate fail hoac SQL migration fail.
- FK khong tao duoc.

### Cach rollback

```powershell
npx prisma migrate reset --force --skip-seed
```

### Tieu chi pass

- Loi relation duoc phat hien khi review/migrate.
- Sau rollback, DB ve trang thai dung.

---

## Case 4. Them cot sai

### Muc tieu

Kiem tra truong hop them cot moi nhung khai bao sai kieu du lieu, default, hoac NOT NULL.

### Cach tao loi

1. Tam thoi them cot sai vao model.
   - Vi du: them cot `status` NOT NULL nhung khong co default trong bang dang co record cu.
2. Hoac them cot voi kieu khong phu hop du lieu hien co.
3. Chay:

```powershell
npx prisma migrate dev --name test_add_column_error
```

### Ky vong loi

- Migration fail neu DB khong backfill duoc du lieu cu.
- Prisma/PostgreSQL bao canh bao data loss hoac not null violation.

### Cach rollback

```powershell
npx prisma migrate resolve --rolled-back "<ten_migration_loi>"
npx prisma migrate reset --force --skip-seed
```

### Tieu chi pass

- Loi them cot duoc phat hien truoc khi merge.
- Co ke hoach backfill hoac default ro rang neu muon de cot moi lai dung.

---

## Checklist test rollback tong hop

- [ ] Test enum sai
- [ ] Test unique constraint sai
- [ ] Test relation sai
- [ ] Test them cot sai
- [ ] Reset DB sau moi lan test
- [ ] Seed lai sau khi reset
- [ ] Ghi ket qua vao file progress summary

## Mau ghi ket qua test

```text
Ngay test: YYYY-MM-DD
Case test: enum / unique / relation / add column
Lenh da chay: ...
Ket qua: PASS/FAIL
Loi ghi nhan: ...
Cach rollback da dung: ...
Ket qua sau rollback: ...
```

## Ghi chu cho team

- Neu migration loi da len production, khong dung reset; phai co migration sua nguoc va quy trinh backup/restore phu hop.
- O phase hoc tap/dev, reset la cach rollback don gian va an toan nhat.
