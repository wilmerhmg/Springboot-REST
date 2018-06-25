package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ActivoEstado {
    private String[] FIELDS = {"id_estado", "desc_estado"};
    private String desc_estado;
    private Integer id_estado;

    public ActivoEstado() {
    }

    public ActivoEstado(String desc_estado, Integer id_estado) {
        this.desc_estado = desc_estado;
        this.id_estado = id_estado;
    }

    public String getDesc_estado() {
        return desc_estado != null ? desc_estado.toUpperCase() : null;
    }

    public Integer getId_estado() {
        return id_estado > 0 ? id_estado : null;
    }

    public void setDesc_estado(String desc_estado) {
        this.desc_estado = desc_estado;
    }

    public void setId_estado(Integer id_estado) {
        this.id_estado = id_estado;
    }

    public Boolean validate() throws NotFoundException {
        if (this.desc_estado.length() < 4 || this.desc_estado == null)
            throw new NotFoundException("Descripcion del estado muy corto: " + this.desc_estado, 400);
        return true;
    }

    public ActivoEstado save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_estado == null || this.id_estado == 0)
            return this.insert();
        else
            return this.update();
    }

    protected ActivoEstado insert() throws NotFoundException {
        String SQL = Database.QueryInsert("activo_estado", FIELDS);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            ResultSet Response = null;
            STMT.setString(1, null);
            STMT.setString(2, this.getDesc_estado());
            STMT.execute();
            STMT.close();
            STMT = Constants.DB.prepareStatement("SELECT LAST_INSERT_ID() AS NEW_ID");
            Response = STMT.executeQuery();
            if (Response.next())
                this.setId_estado(Response.getInt("NEW_ID"));
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected ActivoEstado update() throws NotFoundException {
        String SQL = Database.QueryUpdate("activo_estado", FIELDS, "id_estado=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, this.getId_estado());
            STMT.setString(2, this.getDesc_estado());
            STMT.setInt(3, this.getId_estado());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_estado) throws NotFoundException {
        String SQL = Database.QueryDelete("activo_estado", "id_estado=?");
        if (id_estado.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_estado);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM activo_estado WHERE id_estado=? LIMIT 1");
            ResultSet Response = null;
            STMT.setInt(1, this.getId_estado());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_estado(Response.getInt("id_estado"));
                this.setDesc_estado(Response.getString("desc_estado"));
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
        List<Object> ActivoEstados = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM activo_estado LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                ActivoEstado ESTADO = new ActivoEstado();
                ESTADO.setId_estado(Response.getInt("id_estado"));
                ESTADO.setDesc_estado(Response.getString("desc_estado"));
                ActivoEstados.add(ESTADO);
            }

            Response.close();
            STMT.close();

            BindData.setRows(ActivoEstados);
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