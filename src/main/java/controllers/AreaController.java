package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Paginator;
import org.springframework.web.bind.annotation.*;
import models.Area;

@RestController
public class AreaController {

    @RequestMapping(value = "/area/{id_area}", method = RequestMethod.GET)
    public Area GET(@PathVariable(value = "id_area") String id_area) throws NotFoundException, NotFoundResource {
        Area AREA = new Area();
        AREA.setId_area(id_area);
        AREA.load();
        return AREA;
    }

    @RequestMapping(value = "/area", method = RequestMethod.POST)
    public Area POST(
            @RequestParam(value = "emp_id", defaultValue = "") String emp_id,
            @RequestParam(value = "mun_id", defaultValue = "") Integer mun_id,
            @RequestParam(value = "nom_area", defaultValue = "") String nom_area,
            @RequestParam(value = "cod_area", defaultValue = "") String cod_area) throws NotFoundException {
        Area AREA = new Area(null, emp_id, mun_id, nom_area, cod_area);
        AREA.save();
        return AREA;
    }

    @RequestMapping(value = "/area/{id_area}", method = RequestMethod.PUT)
    public Area PUT(
            @PathVariable(value = "id_area") String id_area,
            @RequestParam(value = "emp_id", defaultValue = "") String emp_id,
            @RequestParam(value = "mun_id", defaultValue = "") Integer mun_id,
            @RequestParam(value = "nom_area", defaultValue = "") String nom_area,
            @RequestParam(value = "cod_area", defaultValue = "") String cod_area) throws NotFoundException {
        Area AREA = new Area(id_area, emp_id, mun_id, nom_area, cod_area);
        AREA.save();
        return AREA;
    }

    @RequestMapping(value = "/area/{id_area}", method = RequestMethod.DELETE)
    public Boolean DELETE(@PathVariable(value = "id_area") String id_area) throws NotFoundException {
        return new Area().delete(id_area);
    }

    @RequestMapping(value = "/area/collection", method = RequestMethod.GET)
    public Paginator LIST(@RequestParam(value = "page", defaultValue = "0") Integer Page) throws NotFoundException {
        return Area.collection(Page);
    }
}

