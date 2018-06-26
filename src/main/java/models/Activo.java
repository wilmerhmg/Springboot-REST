package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class Activo {
    private String[] FIELDS = {"id_act", "nom_act", "desc_act", "tipo_id", "srl_act", "num_inv_int_act", "peso_act",
            "alto_act", "ancho_act", "largo_act", "val_comp_act", "fecha_comp_act", "estado_id", "fecha_baja_act",
            "color_act"};

    private String id_act, nom_act, desc_act, srl_act, color_act;
    private Integer tipo_id, num_inv_int_act, estado_id;
    private Float peso_act, alto_act, ancho_act, largo_act, val_comp_act;
    private Date fecha_comp_act, fecha_baja_act;

    public Activo() {
    }

    public Activo(String id_act, String nom_act) {
        this.id_act = id_act;
        this.nom_act = nom_act;
    }

    public Activo(String id_act, String nom_act, String desc_act, String srl_act, String color_act, Integer tipo_id,
                  Integer num_inv_int_act, Integer estado_id, Float peso_act, Float alto_act, Float ancho_act,
                  Float largo_act, Float val_comp_act, String fecha_comp_act, String fecha_baja_act) {
        this.id_act = id_act;
        this.nom_act = nom_act;
        this.desc_act = desc_act;
        this.srl_act = srl_act;
        this.color_act = color_act;
        this.tipo_id = tipo_id;
        this.num_inv_int_act = num_inv_int_act;
        this.estado_id = estado_id;
        this.peso_act = peso_act;
        this.alto_act = alto_act;
        this.ancho_act = ancho_act;
        this.largo_act = largo_act;
        this.val_comp_act = val_comp_act;
        try {
            this.setFecha_baja_act(fecha_baja_act);
            this.setFecha_comp_act(fecha_comp_act);
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }

    public String getId_act() {
        return id_act;
    }

    public String getNom_act() {
        return nom_act != null ? nom_act.toUpperCase() : null;
    }

    public String getDesc_act() {
        return desc_act;
    }

    public String getSrl_act() {
        return srl_act;
    }

    public String getColor_act() {
        return color_act != null ? color_act.toUpperCase() : null;
    }

    public Integer getTipo_id() {
        return tipo_id > 0 ? tipo_id : null;
    }

    public Integer getNum_inv_int_act() {
        return num_inv_int_act;
    }

    public Integer getEstado_id() {
        return estado_id > 0 ? estado_id : null;
    }

    public Float getPeso_act() {
        return peso_act;
    }

    public Float getAlto_act() {
        return alto_act;
    }

    public Float getAncho_act() {
        return ancho_act;
    }

    public Float getLargo_act() {
        return largo_act;
    }

    public Float getVal_comp_act() {
        return val_comp_act;
    }

    public java.sql.Date getFecha_comp_act() {
        try {
            java.sql.Date DBDate = java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(this.fecha_comp_act));
            return DBDate;
        } catch (NullPointerException e) {
            return null;
        }
    }

    public java.sql.Date getFecha_baja_act() {
        try {
            java.sql.Date DBDate = java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(this.fecha_baja_act));
            return DBDate;
        } catch (NullPointerException e) {
            return null;
        }
    }

    public void setId_act(String id_act) {
        this.id_act = id_act;
    }

    public void setNom_act(String nom_act) {
        this.nom_act = nom_act;
    }

    public void setDesc_act(String desc_act) {
        this.desc_act = desc_act;
    }

    public void setSrl_act(String srl_act) {
        this.srl_act = srl_act;
    }

    public void setColor_act(String color_act) {
        this.color_act = color_act;
    }

    public void setTipo_id(Integer tipo_id) {
        this.tipo_id = tipo_id;
    }

    public void setNum_inv_int_act(Integer num_inv_int_act) {
        this.num_inv_int_act = num_inv_int_act;
    }

    public void setEstado_id(Integer estado_id) {
        this.estado_id = estado_id;
    }

    public void setPeso_act(Float peso_act) {
        this.peso_act = peso_act;
    }

    public void setAlto_act(Float alto_act) {
        this.alto_act = alto_act;
    }

    public void setAncho_act(Float ancho_act) {
        this.ancho_act = ancho_act;
    }

    public void setLargo_act(Float largo_act) {
        this.largo_act = largo_act;
    }

    public void setVal_comp_act(Float val_comp_act) {
        this.val_comp_act = val_comp_act;
    }

    public void setFecha_comp_act(String fecha_comp_act) throws NotFoundException {
        try {
            this.fecha_comp_act = (new SimpleDateFormat("yyyy-MM-dd")).parse(fecha_comp_act);
        } catch (ParseException E) {
            if (fecha_comp_act.length() > 0) throw new NotFoundException("Formato de fecha no valido", 400);
            else this.fecha_comp_act = null;
        }
    }

    public void setFecha_comp_act(Date fecha_comp_act) {
        this.fecha_comp_act = fecha_comp_act;
    }

    public void setFecha_baja_act(String fecha_baja_act) throws NotFoundException {
        try {
            this.fecha_baja_act = (new SimpleDateFormat("yyyy-MM-dd")).parse(fecha_baja_act);
        } catch (ParseException E) {
            if (fecha_baja_act.length() > 0) throw new NotFoundException("Formato de fecha no valido", 400);
            else this.fecha_baja_act = null;
        }
    }

    public void setFecha_baja_act(Date fecha_baja_act) {
        this.fecha_baja_act = fecha_baja_act;
    }

    public Boolean validate() throws NotFoundException {
        if (this.getFecha_comp_act().compareTo(this.getFecha_baja_act()) >= 0)
            throw new NotFoundException("Las fechas no pueden ser inferiores a la de compra", 400);
        return true;
    }

    public Activo save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_act == null || this.id_act.equals(""))
            return this.insert();
        else
            return this.update();
    }

    protected Activo insert() throws NotFoundException {
        String SQL = Database.QueryInsert("activos", FIELDS);
        this.setId_act(UUID.randomUUID().toString());
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_act());
            STMT.setString(2, this.getNom_act());
            STMT.setString(3, this.getDesc_act());
            STMT.setInt(4, this.getTipo_id());
            STMT.setString(5, this.getSrl_act());
            STMT.setInt(6, this.getNum_inv_int_act());
            STMT.setFloat(7, this.getPeso_act());
            STMT.setFloat(8, this.getAlto_act());
            STMT.setFloat(9, this.getAncho_act());
            STMT.setFloat(10, this.getLargo_act());
            STMT.setFloat(11, this.getVal_comp_act());
            STMT.setDate(12, this.getFecha_comp_act());
            STMT.setInt(13, this.getEstado_id());
            STMT.setDate(14, this.getFecha_baja_act());
            STMT.setString(15, this.getColor_act());
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected Activo update() throws NotFoundException {
        String SQL = Database.QueryUpdate("activos", FIELDS, "id_act=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.getId_act());
            STMT.setString(2, this.getNom_act());
            STMT.setString(3, this.getDesc_act());
            STMT.setInt(4, this.getTipo_id());
            STMT.setString(5, this.getSrl_act());
            STMT.setInt(6, this.getNum_inv_int_act());
            STMT.setFloat(7, this.getPeso_act());
            STMT.setFloat(8, this.getAlto_act());
            STMT.setFloat(9, this.getAncho_act());
            STMT.setFloat(10, this.getLargo_act());
            STMT.setFloat(11, this.getVal_comp_act());
            STMT.setDate(12, this.getFecha_comp_act());
            STMT.setInt(13, this.getEstado_id());
            STMT.setDate(14, this.getFecha_baja_act());
            STMT.setString(15, this.getColor_act());
            STMT.setString(16, this.getId_act());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_act) throws NotFoundException {
        String SQL = Database.QueryDelete("activos", "id_act=?");
        if (id_act.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_act);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM activos WHERE id_act=? LIMIT 1");
            ResultSet Response = null;
            STMT.setString(1, this.getId_act());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_act(Response.getString("id_act"));
                this.setNom_act(Response.getString("nom_act"));
                this.setDesc_act(Response.getString("desc_act"));
                this.setTipo_id(Response.getInt("tipo_id"));
                this.setSrl_act(Response.getString("srl_act"));
                this.setNum_inv_int_act(Response.getInt("num_inv_int_act"));
                this.setPeso_act(Response.getFloat("peso_act"));
                this.setAlto_act(Response.getFloat("alto_act"));
                this.setAncho_act(Response.getFloat("ancho_act"));
                this.setLargo_act(Response.getFloat("largo_act"));
                this.setVal_comp_act(Response.getFloat("val_comp_act"));
                this.setFecha_comp_act(Response.getDate("fecha_comp_act"));
                this.setEstado_id(Response.getInt("estado_id"));
                this.setFecha_baja_act(Response.getDate("fecha_baja_act"));
            }
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
    }

    public static Paginator collection(Integer Page) throws NotFoundException {
        List<Object> Personas = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM activos LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Activo ACTIVO = new Activo();
                ACTIVO.setId_act(Response.getString("id_act"));
                ACTIVO.setNom_act(Response.getString("nom_act"));
                ACTIVO.setDesc_act(Response.getString("desc_act"));
                ACTIVO.setTipo_id(Response.getInt("tipo_id"));
                ACTIVO.setSrl_act(Response.getString("srl_act"));
                ACTIVO.setNum_inv_int_act(Response.getInt("num_inv_int_act"));
                ACTIVO.setPeso_act(Response.getFloat("peso_act"));
                ACTIVO.setAlto_act(Response.getFloat("alto_act"));
                ACTIVO.setAncho_act(Response.getFloat("ancho_act"));
                ACTIVO.setLargo_act(Response.getFloat("largo_act"));
                ACTIVO.setVal_comp_act(Response.getFloat("val_comp_act"));
                ACTIVO.setFecha_comp_act(Response.getDate("fecha_comp_act"));
                ACTIVO.setEstado_id(Response.getInt("estado_id"));
                ACTIVO.setFecha_baja_act(Response.getDate("fecha_baja_act"));
                Personas.add(ACTIVO);
            }

            Response.close();
            STMT.close();

            BindData.setRows(Personas);
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

    public static Select2 find(Integer p, String q) {
        Select2 BindData = new Select2();
        Integer Pag = 10 * (p - 1);
        List<Object> ACTIVOS = new ArrayList<>();
        try {
            String SQL = "SELECT id_act,nom_act,desc_estado,COALESCE(srl_act,'SIN SERIAL') AS srl_act FROM activos LEFT JOIN activo_tipo ON (activos.tipo_id = activo_tipo.id_tipo) " +
                    "LEFT JOIN activo_estado ON (activos.estado_id = activo_estado.id_estado) " +
                    "WHERE (activos.nom_act LIKE ? ) OR (activos.srl_act LIKE ?) ORDER BY activos.nom_act LIMIT ?,10";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, "%" + q + "%");
            STMT.setString(2, "%" + q + "%");
            STMT.setInt(3, Pag);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Select2.Adapter Adapter = new Select2.Adapter();
                Adapter.setId(Response.getString("id_act"));
                Adapter.setLabel(Response.getString("nom_act"));
                Adapter.setMore(Response.getString("srl_act") + " - " + Response.getString("desc_estado"));
                ACTIVOS.add(Adapter);
            }

            Response.close();
            STMT.close();

            BindData.setData(ACTIVOS);
            STMT = Constants.DB.prepareStatement("SELECT FOUND_ROWS() AS Total");
            Response = STMT.executeQuery();
            if (Response.next()) {
                BindData.setTotal(Response.getInt("Total"));
            } else {
                BindData.setTotal(0);
            }

            Response.close();
            STMT.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return BindData;
    }
}
