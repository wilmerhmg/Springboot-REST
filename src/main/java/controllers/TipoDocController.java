package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import models.TipoDocumento;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
public class TipoDocController {

    @RequestMapping(value = "/persona/documento/{id_tipo_doc}", method = RequestMethod.GET)
    public TipoDocumento GET(@PathVariable(value = "id_tipo_doc") Integer id_tipo_doc) throws NotFoundException, NotFoundResource {
        TipoDocumento TIPO = new TipoDocumento();
        TIPO.setId_tipo_doc(id_tipo_doc);
        TIPO.load();
        return TIPO;
    }

    @RequestMapping(value = "/persona/documento", method = RequestMethod.POST)
    public TipoDocumento POST(@RequestParam(value = "nom_tipo_doc", defaultValue = "") String nom_tipo_doc,
                              @RequestParam(value = "sigla_tipo_doc", defaultValue = "") String sigla_tipo_doc) throws NotFoundException {
        TipoDocumento TIPO = new TipoDocumento(null, nom_tipo_doc, sigla_tipo_doc);
        TIPO.save();
        return TIPO;
    }

    @RequestMapping(value = "/persona/documento/{id_tipo_doc}", method = RequestMethod.PUT)
    public TipoDocumento PUT(@PathVariable(value = "id_tipo_doc") Integer id_tipo_doc,
                             @RequestParam(value = "nom_tipo_doc", defaultValue = "") String nom_tipo_doc,
                             @RequestParam(value = "sigla_tipo_doc", defaultValue = "") String sigla_tipo_doc) throws NotFoundException {
        TipoDocumento TIPO = new TipoDocumento(id_tipo_doc, nom_tipo_doc, sigla_tipo_doc);
        TIPO.save();
        return TIPO;
    }

    @RequestMapping(value = "/persona/documento/{id_tipo_doc}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_tipo_doc") String id_tipo_doc) throws NotFoundException {
        return new TipoDocumento().delete(id_tipo_doc);
    }

    @RequestMapping(value = "/persona/documento/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return TipoDocumento.collection(Page);
    }
}