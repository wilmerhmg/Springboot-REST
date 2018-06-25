package controllers;

import config.NotFoundException;
import models.Persona;
import org.springframework.web.bind.annotation.*;

@RestController
public class PersonaController {

    @RequestMapping(value = "/persona", method = RequestMethod.GET)
    public Persona GET(@RequestParam(value = "id_per", defaultValue = "") String id_per) {
        Persona PERSONA = new Persona();
        PERSONA.setId_per(id_per);
        return PERSONA;
    }

    @RequestMapping(value = "/persona", method = RequestMethod.POST)
    public Persona POST(
            @RequestParam(value = "num_doc_per", defaultValue = "") String num_doc_per,
            @RequestParam(value = "tipo_doc_id", defaultValue = "") Integer tipo_doc_id,
            @RequestParam(value = "mun_exp_doc_id", defaultValue = "") Integer mun_exp_doc_id,
            @RequestParam(value = "gen_per", defaultValue = "") String gen_per,
            @RequestParam(value = "nom1_per", defaultValue = "") String nom1_per,
            @RequestParam(value = "nom2_per", defaultValue = "") String nom2_per,
            @RequestParam(value = "ape1_per", defaultValue = "") String ape1_per,
            @RequestParam(value = "ape2_per", defaultValue = "") String ape2_per,
            @RequestParam(value = "fecha_nac_per", defaultValue = "") String fecha_nac_per,
            @RequestParam(value = "mun_res_per_id", defaultValue = "") Integer mun_res_per_id,
            @RequestParam(value = "dir_per", defaultValue = "") String dir_per,
            @RequestParam(value = "cel_per", defaultValue = "") String cel_per,
            @RequestParam(value = "email_per", defaultValue = "") String email_per) throws NotFoundException {
        Persona PERSONA = new Persona(null, num_doc_per, tipo_doc_id, mun_exp_doc_id, gen_per, nom1_per, nom2_per, ape1_per, ape2_per, fecha_nac_per, mun_res_per_id, dir_per, cel_per, email_per);
        PERSONA.save();
        return PERSONA;
    }

    @RequestMapping(value = "/persona/{id_per}", method = RequestMethod.PUT)
    public Persona PUT(
            @PathVariable(value = "id_per") String id_per,
            @RequestParam(value = "num_doc_per", defaultValue = "") String num_doc_per,
            @RequestParam(value = "tipo_doc_id", defaultValue = "") Integer tipo_doc_id,
            @RequestParam(value = "mun_exp_doc_id", defaultValue = "") Integer mun_exp_doc_id,
            @RequestParam(value = "gen_per", defaultValue = "") String gen_per,
            @RequestParam(value = "nom1_per", defaultValue = "") String nom1_per,
            @RequestParam(value = "nom2_per", defaultValue = "") String nom2_per,
            @RequestParam(value = "ape1_per", defaultValue = "") String ape1_per,
            @RequestParam(value = "ape2_per", defaultValue = "") String ape2_per,
            @RequestParam(value = "fecha_nac_per", defaultValue = "") String fecha_nac_per,
            @RequestParam(value = "mun_res_per_id", defaultValue = "") Integer mun_res_per_id,
            @RequestParam(value = "dir_per", defaultValue = "") String dir_per,
            @RequestParam(value = "cel_per", defaultValue = "") String cel_per,
            @RequestParam(value = "email_per", defaultValue = "") String email_per) throws NotFoundException {
        Persona PERSONA = new Persona(id_per, num_doc_per, tipo_doc_id, mun_exp_doc_id, gen_per, nom1_per, nom2_per, ape1_per, ape2_per, fecha_nac_per, mun_res_per_id, dir_per, cel_per, email_per);
        PERSONA.save();
        return PERSONA;
    }

    @RequestMapping(value = "/persona/{id_per}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_per") String id_per) throws NotFoundException {
        return new Persona().delete(id_per);
    }
}

