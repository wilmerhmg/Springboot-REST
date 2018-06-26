package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import core.Select2;
import models.Activo;
import org.springframework.web.bind.annotation.*;

@RestController
public class ActivoController {

    @RequestMapping(value = "/activo/{id_act}", method = RequestMethod.GET)
    public Activo GET(@PathVariable(value = "id_act") String id_act) throws NotFoundException {
        Activo PERSONA = new Activo();
        PERSONA.setId_act(id_act);
        PERSONA.load();
        return PERSONA;
    }

    @RequestMapping(value = "/activo", method = RequestMethod.POST)
    public Activo POST(
            @RequestParam(value = "nom_act", defaultValue = "") String nom_act,
            @RequestParam(value = "desc_act", defaultValue = "") String desc_act,
            @RequestParam(value = "tipo_id", defaultValue = "0") Integer tipo_id,
            @RequestParam(value = "srl_act", defaultValue = "") String srl_act,
            @RequestParam(value = "num_inv_int_act", defaultValue = "") Integer num_inv_int_act,
            @RequestParam(value = "peso_act", defaultValue = "0") Float peso_act,
            @RequestParam(value = "alto_act", defaultValue = "0") Float alto_act,
            @RequestParam(value = "ancho_act", defaultValue = "0") Float ancho_act,
            @RequestParam(value = "largo_act", defaultValue = "0") Float largo_act,
            @RequestParam(value = "val_comp_act", defaultValue = "0") Float val_comp_act,
            @RequestParam(value = "fecha_comp_act", defaultValue = "") String fecha_comp_act,
            @RequestParam(value = "estado_id", defaultValue = "0") Integer estado_id,
            @RequestParam(value = "fecha_baja_act", defaultValue = "") String fecha_baja_act,
            @RequestParam(value = "color_act", defaultValue = "") String color_act) throws NotFoundException {
        Activo ACTIVO = new Activo(null, nom_act, desc_act, srl_act, color_act, tipo_id,
                num_inv_int_act, estado_id, peso_act, alto_act, ancho_act,
                largo_act, val_comp_act, fecha_comp_act, fecha_baja_act);
        ACTIVO.save();
        return ACTIVO;
    }

    @RequestMapping(value = "/activo/{id_act}", method = RequestMethod.PUT)
    public Activo PUT(
            @PathVariable(value = "id_act") String id_act,
            @RequestParam(value = "nom_act", defaultValue = "") String nom_act,
            @RequestParam(value = "desc_act", defaultValue = "") String desc_act,
            @RequestParam(value = "tipo_id", defaultValue = "0") Integer tipo_id,
            @RequestParam(value = "srl_act", defaultValue = "") String srl_act,
            @RequestParam(value = "num_inv_int_act", defaultValue = "") Integer num_inv_int_act,
            @RequestParam(value = "peso_act", defaultValue = "0") Float peso_act,
            @RequestParam(value = "alto_act", defaultValue = "0") Float alto_act,
            @RequestParam(value = "ancho_act", defaultValue = "0") Float ancho_act,
            @RequestParam(value = "largo_act", defaultValue = "0") Float largo_act,
            @RequestParam(value = "val_comp_act", defaultValue = "0") Float val_comp_act,
            @RequestParam(value = "fecha_comp_act", defaultValue = "") String fecha_comp_act,
            @RequestParam(value = "estado_id", defaultValue = "0") Integer estado_id,
            @RequestParam(value = "fecha_baja_act", defaultValue = "") String fecha_baja_act,
            @RequestParam(value = "color_act", defaultValue = "") String color_act) throws NotFoundException {
        Activo ACTIVO = new Activo(id_act, nom_act, desc_act, srl_act, color_act, tipo_id,
                num_inv_int_act, estado_id, peso_act, alto_act, ancho_act,
                largo_act, val_comp_act, fecha_comp_act, fecha_baja_act);
        ACTIVO.save();
        return ACTIVO;
    }

    @RequestMapping(value = "/activo/{id_act}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_act") String id_act) throws NotFoundException {
        return new Activo().delete(id_act);
    }

    @RequestMapping(value = "/activo/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return Activo.collection(Page);
    }

    @RequestMapping(value = "/activo/search", method = RequestMethod.GET)
    public Select2 LIST(@RequestParam(value = "page", defaultValue = "1") Integer p,
                        @RequestParam(value = "q", defaultValue = "") String q) {
        return Activo.find(p, q);
    }
}

