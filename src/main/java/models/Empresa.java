package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Empresa {
    private String[] FIELDS = {"id_emp", "nom_emp", "mun_emp", "nit_emp", "dir_emp", "tel_emp"};
    private String id_emp, nom_emp, nit_emp, dir_emp, tel_emp;
    private Integer mun_emp;

    public Empresa() {
    }

    public Empresa(String id_emp, String nom_emp, String nit_emp, String dir_emp, String tel_emp, Integer mun_emp) {
        this.id_emp = id_emp;
        this.nom_emp = nom_emp;
        this.nit_emp = nit_emp;
        this.dir_emp = dir_emp;
        this.tel_emp = tel_emp;
        this.mun_emp = mun_emp;
    }

    public String getId_emp() {
        return id_emp;
    }

    public String getNom_emp() {
        return nom_emp != null ? nom_emp.toUpperCase() : null;
    }

    public String getNit_emp() {
        return nit_emp;
    }

    public String getDir_emp() {
        return dir_emp;
    }

    public String getTel_emp() {
        return tel_emp;
    }

    public Integer getMun_emp() {
        return mun_emp > 0 ? mun_emp : null;
    }

    public void setId_emp(String id_emp) {
        this.id_emp = id_emp;
    }

    public void setNom_emp(String nom_emp) {
        this.nom_emp = nom_emp;
    }

    public void setNit_emp(String nit_emp) {
        this.nit_emp = nit_emp;
    }

    public void setDir_emp(String dir_emp) {
        this.dir_emp = dir_emp;
    }

    public void setTel_emp(String tel_emp) {
        this.tel_emp = tel_emp;
    }

    public void setMun_emp(Integer mun_emp) {
        this.mun_emp = mun_emp;
    }

    public Boolean validate() throws NotFoundException {
        if (this.getMun_emp() == null)
            throw new NotFoundException("Municipio no valido: " + this.mun_emp, 400);
        if (this.nom_emp.length() < 4 || this.nom_emp == null)
            throw new NotFoundException("Nombre de la empresa muy corto: " + this.nom_emp, 400);
        return true;
    }

    public Empresa save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_emp == null || this.id_emp.equals(""))
            return this.insert();
        else
            return this.update();
    }

    protected Empresa insert() throws NotFoundException {
        String SQL = Database.QueryInsert("empresa", FIELDS);
        this.setId_emp(UUID.randomUUID().toString());
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_emp());
            STMT.setString(2, this.getNom_emp());
            STMT.setInt(3, this.getMun_emp());
            STMT.setString(4, this.getNit_emp());
            STMT.setString(5, this.getDir_emp());
            STMT.setString(6, this.getTel_emp());
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected Empresa update() throws NotFoundException {
        String SQL = Database.QueryUpdate("empresa", FIELDS, "id_emp=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_emp());
            STMT.setString(2, this.getNom_emp());
            STMT.setInt(3, this.getMun_emp());
            STMT.setString(4, this.getNit_emp());
            STMT.setString(5, this.getDir_emp());
            STMT.setString(6, this.getTel_emp());
            STMT.setString(7, this.getId_emp());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_emp) throws NotFoundException {
        String SQL = Database.QueryDelete("empresa", "id_emp=?");
        if (id_emp.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_emp);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM empresa WHERE id_emp=? LIMIT 1");
            ResultSet Response = null;
            STMT.setString(1, this.getId_emp());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_emp(Response.getString("id_emp"));
                this.setNom_emp(Response.getString("nom_emp"));
                this.setMun_emp(Response.getInt("mun_emp"));
                this.setNit_emp(Response.getString("nit_emp"));
                this.setDir_emp(Response.getString("dir_emp"));
                this.setTel_emp(Response.getString("tel_emp"));
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
        List<Object> Areas = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM empresa LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Empresa EMPRESA = new Empresa();
                EMPRESA.setId_emp(Response.getString("id_emp"));
                EMPRESA.setNom_emp(Response.getString("nom_emp"));
                EMPRESA.setMun_emp(Response.getInt("mun_emp"));
                EMPRESA.setNit_emp(Response.getString("nit_emp"));
                EMPRESA.setDir_emp(Response.getString("dir_emp"));
                EMPRESA.setTel_emp(Response.getString("tel_emp"));
                Areas.add(EMPRESA);
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
