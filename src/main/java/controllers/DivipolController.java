package controllers;

import core.NotFoundException;
import core.NotFoundResource;
import core.Select2;
import models.Divipol;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(maxAge = 3600)
@RestController
public class DivipolController {

    @RequestMapping(value = "/divipol/{id}", method = RequestMethod.GET)

    public Divipol GET(@PathVariable(value = "id") Integer id) throws NotFoundException, NotFoundResource {
        Divipol MPIO = new Divipol();
        MPIO.setId(id);
        MPIO.load();
        return MPIO;
    }

    @RequestMapping(value = "/divipol/search", method = RequestMethod.GET)
    public Select2 LIST(@RequestParam(value = "page", defaultValue = "1") Integer p,
                        @RequestParam(value = "q", defaultValue = "") String q) throws NotFoundException, NotFoundResource {
        return Divipol.find(p, q);
    }
}