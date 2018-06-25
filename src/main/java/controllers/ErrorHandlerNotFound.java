package controllers;

import core.NotFoundResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class ErrorHandlerNotFound {
    @ExceptionHandler(NotFoundResource.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public Object Error(NotFoundResource ex) {
        String result = ex.getMessage();
        System.out.println("RECURSO SIN RESULTADOS: \t\t" + result);
        return ex;
    }
}
