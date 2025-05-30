from database import Base, engine
import models

print("Creando las tablas en la base de datos...")
Base.metadata.create_all(bind=engine)
print("¡Listo!")
