package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import models.Asignacion;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
public class AsignacionController {

    @RequestMapping(value = "/asignacion/{id_asignacion}", method = RequestMethod.GET)
    public Asignacion GET(@PathVariable(value = "id_asignacion") String id_asignacion) throws NotFoundException, NotFoundResource {
        Asignacion ASG = new Asignacion();
        ASG.setId_asignacion(id_asignacion);
        ASG.load();
        return ASG;
    }

    @RequestMapping(value = "/asignacion", method = RequestMethod.POST)
    public Asignacion POST(
            @RequestParam(value = "activo_id", defaultValue = "") String activo_id,
            @RequestParam(value = "area_id", defaultValue = "") String area_id,
            @RequestParam(value = "persona_id", defaultValue = "") String persona_id) throws NotFoundException {
        Asignacion ASG = new Asignacion(null, activo_id, area_id, persona_id);
        ASG.save();
        return ASG;
    }

    @RequestMapping(value = "/asignacion/{id_asignacion}", method = RequestMethod.PUT)
    public Asignacion PUT(
            @PathVariable(value = "id_asignacion") String id_asignacion,
            @RequestParam(value = "activo_id", defaultValue = "") String activo_id,
            @RequestParam(value = "area_id", defaultValue = "") String area_id,
            @RequestParam(value = "persona_id", defaultValue = "") String persona_id) throws NotFoundException {
        Asignacion ASG = new Asignacion(id_asignacion, activo_id, area_id, persona_id);
        ASG.save();
        return ASG;
    }

    @RequestMapping(value = "/asignacion/{id_asignacion}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_asignacion") String id_asignacion) throws NotFoundException {
        return new Asignacion().delete(id_asignacion);
    }

    @RequestMapping(value = "/asignacion/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return Asignacion.collection(Page);
    }
}

