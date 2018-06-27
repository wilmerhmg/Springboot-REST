package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import models.ActivoEstado;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
public class ActivoEstadoController {

    @RequestMapping(value = "/activo/estado/{id_area}", method = RequestMethod.GET)
    public ActivoEstado GET(@PathVariable(value = "id_area") Integer id_estado) throws NotFoundException, NotFoundResource {
        ActivoEstado AESTADO = new ActivoEstado();
        AESTADO.setId_estado(id_estado);
        AESTADO.load();
        return AESTADO;
    }

    @RequestMapping(value = "/activo/estado", method = RequestMethod.POST)
    public ActivoEstado POST(@RequestParam(value = "desc_estado", defaultValue = "") String desc_estado) throws NotFoundException {
        ActivoEstado AESTADO = new ActivoEstado(desc_estado, null);
        AESTADO.save();
        return AESTADO;
    }

    @RequestMapping(value = "/activo/estado/{id_estado}", method = RequestMethod.PUT)
    public ActivoEstado PUT(
            @PathVariable(value = "id_estado") Integer id_estado,
            @RequestParam(value = "desc_estado", defaultValue = "") String desc_estado) throws NotFoundException {
        ActivoEstado AESTADO = new ActivoEstado(desc_estado, id_estado);
        AESTADO.save();
        return AESTADO;
    }

    @RequestMapping(value = "/activo/estado/{id_estado}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_estado") String id_estado) throws NotFoundException {
        return new ActivoEstado().delete(id_estado);
    }

    @RequestMapping(value = "/activo/estado/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return ActivoEstado.collection(Page);
    }
}