package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class ActivoTipo {
    private String[] FIELDS = {"id_tipo", "desc_tipo"};
    private String desc_tipo;
    private Integer id_tipo;

    public ActivoTipo() {
    }

    public ActivoTipo(String desc_tipo, Integer id_tipo) {
        this.desc_tipo = desc_tipo;
        this.id_tipo = id_tipo;
    }

    public String getDesc_tipo() {
        return desc_tipo != null ? desc_tipo.toUpperCase() : null;
    }

    public void setDesc_tipo(String desc_tipo) {
        this.desc_tipo = desc_tipo;
    }

    public Integer getId_tipo() {
        return id_tipo > 0 ? id_tipo : null;
    }

    public void setId_tipo(Integer id_tipo) {
        this.id_tipo = id_tipo;
    }

    public Boolean validate() throws NotFoundException {
        if (this.desc_tipo.length() < 4 || this.desc_tipo == null)
            throw new NotFoundException("Descripcion del estado muy corto: " + this.desc_tipo, 400);
        return true;
    }

    public ActivoTipo save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_tipo == null || this.id_tipo == 0)
            return this.insert();
        else
            return this.update();
    }

    protected ActivoTipo insert() throws NotFoundException {
        String SQL = Database.QueryInsert("activo_tipo", FIELDS);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            ResultSet Response = null;
            STMT.setString(1, null);
            STMT.setString(2, this.getDesc_tipo());
            STMT.execute();
            STMT.close();
            STMT = Constants.DB.prepareStatement("SELECT LAST_INSERT_ID() AS NEW_ID");
            Response = STMT.executeQuery();
            if (Response.next())
                this.setId_tipo(Response.getInt("NEW_ID"));
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected ActivoTipo update() throws NotFoundException {
        String SQL = Database.QueryUpdate("activo_tipo", FIELDS, "id_tipo=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, this.getId_tipo());
            STMT.setString(2, this.getDesc_tipo());
            STMT.setInt(3, this.getId_tipo());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_tipo) throws NotFoundException {
        String SQL = Database.QueryDelete("activo_tipo", "id_tipo=?");
        if (id_tipo.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_tipo);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM activo_tipo WHERE id_tipo=? LIMIT 1");
            ResultSet Response = null;
            STMT.setInt(1, this.getId_tipo());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_tipo(Response.getInt("id_tipo"));
                this.setDesc_tipo(Response.getString("desc_tipo"));
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
        List<Object> ActivoTipos = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM activo_tipo LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                ActivoTipo TIPO = new ActivoTipo();
                TIPO.setId_tipo(Response.getInt("id_tipo"));
                TIPO.setDesc_tipo(Response.getString("desc_tipo"));
                ActivoTipos.add(TIPO);
            }

            Response.close();
            STMT.close();

            BindData.setRows(ActivoTipos);
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