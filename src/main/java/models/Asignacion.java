package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Asignacion {
    private String[] FIELDS = {"id_asignacion", "activo_id", "area_id", "persona_id"};
    private String id_asignacion, activo_id, area_id, persona_id;

    public Asignacion() {
    }

    public Asignacion(String id_asignacion, String activo_id, String area_id, String persona_id) {
        this.id_asignacion = id_asignacion;
        this.activo_id = activo_id;
        this.area_id = area_id;
        this.persona_id = persona_id;

    }

    public String getId_asignacion() {
        return id_asignacion;
    }

    public String getActivo_id() {
        return activo_id;
    }

    public String getArea_id() {
        return area_id.equals("") ? null : area_id;
    }

    public String getPersona_id() {
        return persona_id.equals("") ? null : persona_id;
    }

    public void setId_asignacion(String id_asignacion) {
        this.id_asignacion = id_asignacion;
    }

    public void setActivo_id(String activo_id) {
        this.activo_id = activo_id;
    }

    public void setArea_id(String area_id) {
        this.area_id = area_id;
    }

    public void setPersona_id(String persona_id) {
        this.persona_id = persona_id;
    }


    public Boolean validate() throws NotFoundException {
        if (this.activo_id == null || this.activo_id.equals(""))
            throw new NotFoundException("Debe seleccionar un activo "+this.activo_id, 400);
        if ((this.area_id == null || this.area_id.equals("")) && (this.persona_id == null || this.persona_id.equals("")))
            throw new NotFoundException("Debe seleccionar un area o una persona", 400);
        return true;
    }

    public Asignacion save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_asignacion == null || this.id_asignacion.equals(""))
            return this.insert();
        else
            return this.update();
    }

    protected Asignacion insert() throws NotFoundException {
        String SQL = Database.QueryInsert("asignaciones", FIELDS);
        this.setId_asignacion(UUID.randomUUID().toString());
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_asignacion());
            STMT.setString(2, this.getActivo_id());
            STMT.setString(3, this.getArea_id());
            STMT.setString(4, this.getPersona_id());
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected Asignacion update() throws NotFoundException {
        String SQL = Database.QueryUpdate("asignaciones", FIELDS, "id_asignacion=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_asignacion());
            STMT.setString(2, this.getActivo_id());
            STMT.setString(3, this.getArea_id());
            STMT.setString(4, this.getPersona_id());
            STMT.setString(5, this.getId_asignacion());

            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_asignacion) throws NotFoundException {
        String SQL = Database.QueryDelete("asignaciones", "id_asignacion=?");
        if (id_asignacion.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_asignacion);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM asignaciones WHERE id_asignacion=? LIMIT 1");
            ResultSet Response = null;
            STMT.setString(1, this.getId_asignacion());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_asignacion(Response.getString("id_asignacion"));
                this.setActivo_id(Response.getString("activo_id"));
                this.setArea_id(Response.getString("area_id") == null ? "" : Response.getString("area_id"));
                System.out.println(Response.getString("persona_id"));
                this.setPersona_id(Response.getString("persona_id") == null ? "" : Response.getString("persona_id"));
            } else {
                throw new NotFoundResource("Sin resultados", 404, "Not Found");
            }
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
    }

    public static Paginator collection(Integer Page) throws NotFoundException {
        List<Object> Asignaciones = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM asignaciones LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Asignacion ASIG = new Asignacion();
                ASIG.setId_asignacion(Response.getString("id_asignacion"));
                ASIG.setActivo_id(Response.getString("activo_id"));
                ASIG.setArea_id(Response.getString("area_id"));
                ASIG.setPersona_id(Response.getString("persona_id"));
                Asignaciones.add(ASIG);
            }

            Response.close();
            STMT.close();

            BindData.setRows(Asignaciones);
            BindData.setPage(Page + 40);
            STMT = Constants.DB.prepareStatement("SELECT FOUND_ROWS() AS Total");
            Response = STMT.executeQuery();
            if (Response.next()) {
                BindData.setTotal(Response.getInt("Total"));
            }

            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return BindData;
    }
}
