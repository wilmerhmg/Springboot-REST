# README #
Desde una terminal de comandos, sobre la raiz del directorio (rootPath)

##### Compilar aplicacion ####
<pre>
rootPath~: gradle clean

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
</pre>
<pre>
rootPath~: gradle build

BUILD SUCCESSFUL in 3s
3 actionable tasks: 3 executed
</pre>

##### Ejecutar Aplicacion ##### 
<pre>
rootPath~: java -jar build/libs/APIRESTful-0.1.0.jar
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.0.3.RELEASE)
 
API it's running at http://localhost:8080
</pre>