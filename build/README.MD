1. En mysql importe la base de datos(nombre inventario) del proyecto
   se encuentra en la raiz del proyecto en gitlab
	https://gitlab.com/wito/JAVA-RESTful/blob/master/Base_de_datos.sql

2. en mysql cree el usuario "asd" con clave "WEYzEsTMYvgKl5JOWblJ"

3. el archivo .war incluye su propoio servidor que corre en el puerto 8080,
   asegurese de que el puerto este disponible.
4. para ejectutar el .war utilice 
   java -jar build/libs/JAVA-RESTful.war

5. puede ingresar por http://IPSERVIDOR:8080 para usar el cliente angular, o usar
   postman para probar los endpoints

Actualmente esta api esta corriendo en: http://173.230.146.20:8080 por lo que puede acceder a testearla
via web y/o postman

La aplicacion usa Java 8