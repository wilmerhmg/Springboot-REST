package core;

public class AsignacionAdapter {
    private String id_asignacion, activo_id, area_id, persona_id, nom_act, Asignado;

    public AsignacionAdapter() {
    }

    public AsignacionAdapter(String id_asignacion, String activo_id, String area_id, String persona_id, String nom_act, String asignado) {
        this.id_asignacion = id_asignacion;
        this.activo_id = activo_id;
        this.area_id = area_id;
        this.persona_id = persona_id;
        this.nom_act = nom_act;
        Asignado = asignado;
    }

    public String getId_asignacion() {
        return id_asignacion;
    }

    public void setId_asignacion(String id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public String getActivo_id() {
        return activo_id;
    }

    public void setActivo_id(String activo_id) {
        this.activo_id = activo_id;
    }

    public String getArea_id() {
        return area_id;
    }

    public void setArea_id(String area_id) {
        this.area_id = area_id;
    }

    public String getPersona_id() {
        return persona_id;
    }

    public void setPersona_id(String persona_id) {
        this.persona_id = persona_id;
    }

    public String getNom_act() {
        return nom_act;
    }

    public void setNom_act(String nom_act) {
        this.nom_act = nom_act;
    }

    public String getAsignado() {
        return Asignado;
    }

    public void setAsignado(String asignado) {
        Asignado = asignado;
    }
}
