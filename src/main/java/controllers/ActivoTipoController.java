package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import models.ActivoTipo;
import org.springframework.web.bind.annotation.*;

@RestController
public class ActivoTipoController {

    @RequestMapping(value = "/activo/tipo/{id_tipo}", method = RequestMethod.GET)
    public ActivoTipo GET(@PathVariable(value = "id_tipo") Integer id_tipo) throws NotFoundException, NotFoundResource {
        ActivoTipo TIPO = new ActivoTipo();
        TIPO.setId_tipo(id_tipo);
        TIPO.load();
        return TIPO;
    }

    @RequestMapping(value = "/activo/tipo", method = RequestMethod.POST)
    public ActivoTipo POST(@RequestParam(value = "desc_tipo", defaultValue = "") String desc_tipo) throws NotFoundException {
        ActivoTipo TIPO = new ActivoTipo(desc_tipo, null);
        TIPO.save();
        return TIPO;
    }

    @RequestMapping(value = "/activo/tipo/{id_tipo}", method = RequestMethod.PUT)
    public ActivoTipo PUT(@PathVariable(value = "id_tipo") Integer id_tipo,
                          @RequestParam(value = "desc_tipo", defaultValue = "") String desc_tipo) throws NotFoundException {
        ActivoTipo TIPO = new ActivoTipo(desc_tipo, id_tipo);
        TIPO.save();
        return TIPO;
    }

    @RequestMapping(value = "/activo/tipo/{id_tipo}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_tipo") String id_tipo) throws NotFoundException {
        return new ActivoTipo().delete(id_tipo);
    }

    @RequestMapping(value = "/activo/tipo/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return ActivoTipo.collection(Page);
    }
}