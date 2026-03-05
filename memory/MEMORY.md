# Project Memory

## Alembic (Backend Schema Migrations)

- Alembic is set up in `../backend/alembic/`
- `Base.metadata.create_all()` is removed — Alembic owns all schema changes
- Migration files: `alembic/versions/NNNN_<description>.py` with sequential string revision IDs
- Workflow after any model change:
  1. `alembic revision --autogenerate -m "<description>"`
  2. Review generated file, ensure `down_revision` chains correctly
  3. `alembic upgrade head`
- Production: start command is `alembic upgrade head && gunicorn app.main:app ...`
- `alembic/env.py` imports all model modules explicitly for autogenerate to work
