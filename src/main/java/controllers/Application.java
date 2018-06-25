package controllers;

import core.Constants;
import core.Database;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.print("--------------------CONEXION INICIADA------------------\n");
        Constants.DB = Database.getConexion();
    }
}