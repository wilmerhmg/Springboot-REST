package controllers;

import core.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Object Error(NotFoundException ex) {
        String result = ex.getMessage();
        System.out.println("ERROR DE VALIDACION: \t\t" + result);
        return ex;
    }
}