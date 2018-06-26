package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Area {
    private String[] FIELDS = {"id_area", "emp_id", "mun_id", "nom_area", "cod_area"};
    private String id_area, emp_id, nom_area, cod_area;
    private Integer mun_id;

    public Area() {
    }

    public Area(String id_area, String emp_id, Integer mun_id, String nom_area, String cod_area) {
        this.id_area = id_area;
        this.emp_id = emp_id;
        this.mun_id = mun_id;
        this.nom_area = nom_area;
        this.cod_area = cod_area;
    }

    public String getId_area() {
        return id_area;
    }

    public String getEmp_id() {
        return emp_id;
    }

    public Integer getMun_id() {
        return mun_id > 0 ? mun_id : null;
    }

    public String getNom_area() {
        return nom_area != null ? nom_area.toUpperCase() : null;
    }

    public String getCod_area() {
        return cod_area != null ? cod_area.toUpperCase() : null;
    }

    public void setId_area(String id_area) {
        this.id_area = id_area;
    }

    public void setEmp_id(String emp_id) {
        this.emp_id = emp_id;
    }

    public void setNom_area(String nom_area) {
        this.nom_area = nom_area;
    }

    public void setCod_area(String cod_area) {
        this.cod_area = cod_area;
    }

    public void setMun_id(Integer mun_id) {
        this.mun_id = mun_id;
    }

    public Boolean validate() throws NotFoundException {
        if (this.emp_id == null)
            throw new NotFoundException("EmpresaController no valida: " + this.emp_id, 400);
        if (this.mun_id == null)
            throw new NotFoundException("Municipio no valido: " + this.mun_id, 400);
        if (this.nom_area.length() < 4 || this.nom_area == null)
            throw new NotFoundException("Nombre del area muy corto: " + this.nom_area, 400);
        return true;
    }

    public Area save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_area == null||this.id_area.equals(""))
            return this.insert();
        else
            return this.update();
    }

    protected Area insert() throws NotFoundException {
        String SQL = Database.QueryInsert("areas", FIELDS);
        this.setId_area(UUID.randomUUID().toString());
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_area());
            STMT.setString(2, this.getEmp_id());
            STMT.setInt(3, this.getMun_id());
            STMT.setString(4, this.getNom_area());
            STMT.setString(5, this.getCod_area());
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected Area update() throws NotFoundException {
        String SQL = Database.QueryUpdate("areas", FIELDS, "id_area=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_area());
            STMT.setString(2, this.getEmp_id());
            STMT.setInt(3, this.getMun_id());
            STMT.setString(4, this.getNom_area());
            STMT.setString(5, this.getCod_area());
            STMT.setString(6, this.getId_area());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_area) throws NotFoundException {
        String SQL = Database.QueryDelete("areas", "id_area=?");
        if (id_area.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_area);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM areas WHERE id_area=? LIMIT 1");
            ResultSet Response = null;
            STMT.setString(1, this.getId_area());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_area(Response.getString("id_area"));
                this.setEmp_id(Response.getString("emp_id"));
                this.setMun_id(Response.getInt("mun_id"));
                this.setNom_area(Response.getString("nom_area"));
                this.setCod_area(Response.getString("cod_area"));
            }else{
                throw new NotFoundResource("Sin resultados", 404,"Not Found");
            }
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
    }

    public static Paginator collection(Integer Page) throws NotFoundException {
        List<Object> Areas = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM areas LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Area AREA = new Area();
                AREA.setId_area(Response.getString("id_area"));
                AREA.setEmp_id(Response.getString("emp_id"));
                AREA.setMun_id(Response.getInt("mun_id"));
                AREA.setNom_area(Response.getString("nom_area"));
                AREA.setCod_area(Response.getString("cod_area"));
                Areas.add(AREA);
            }

            Response.close();
            STMT.close();

            BindData.setRows(Areas);
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
