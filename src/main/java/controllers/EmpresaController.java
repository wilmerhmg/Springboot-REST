package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import models.Empresa;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
public class EmpresaController {

    @RequestMapping(value = "/empresa/{id_emp}", method = RequestMethod.GET)
    public Empresa GET(@PathVariable(value = "id_emp") String id_emp) throws NotFoundException, NotFoundResource {
        Empresa EMP = new Empresa();
        EMP.setId_emp(id_emp);
        EMP.load();
        return EMP;
    }

    @RequestMapping(value = "/empresa", method = RequestMethod.POST)
    public Empresa POST(
            @RequestParam(value = "nom_emp", defaultValue = "") String nom_emp,
            @RequestParam(value = "mun_emp", defaultValue = "") Integer mun_emp,
            @RequestParam(value = "nit_emp", defaultValue = "") String nit_emp,
            @RequestParam(value = "dir_emp", defaultValue = "") String dir_emp,
            @RequestParam(value = "tel_emp", defaultValue = "") String tel_emp) throws NotFoundException {
        Empresa EMP = new Empresa(null, nom_emp, nit_emp, dir_emp, tel_emp, mun_emp);
        EMP.save();
        return EMP;
    }

    @RequestMapping(value = "/empresa/{id_emp}", method = RequestMethod.PUT)
    public Empresa PUT(
            @PathVariable(value = "id_emp") String id_emp,
            @RequestParam(value = "nom_emp", defaultValue = "") String nom_emp,
            @RequestParam(value = "mun_emp", defaultValue = "0") Integer mun_emp,
            @RequestParam(value = "nit_emp", defaultValue = "") String nit_emp,
            @RequestParam(value = "dir_emp", defaultValue = "") String dir_emp,
            @RequestParam(value = "tel_emp", defaultValue = "") String tel_emp) throws NotFoundException {
        Empresa EMP = new Empresa(id_emp, nom_emp, nit_emp, dir_emp, tel_emp, mun_emp);
        EMP.save();
        return EMP;
    }

    @RequestMapping(value = "/empresa/{id_emp}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_emp") String id_emp) throws NotFoundException {
        return new Empresa().delete(id_emp);
    }

    @RequestMapping(value = "/empresa/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return Empresa.collection(Page);
    }
}

