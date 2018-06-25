package models;

import com.mysql.jdbc.Statement;
import config.Constants;
import config.Database;
import config.NotFoundException;
import jdk.nashorn.internal.ir.CatchNode;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class Persona {
    private String[] FIELDS = {"id_per", "num_doc_per", "tipo_doc_id", "mun_exp_doc_id", "gen_per", "nom1_per",
            "nom2_per", "ape1_per", "ape2_per", "fecha_nac_per", "mun_res_per_id", "dir_per", "cel_per", "email_per"};

    private String id_per, num_doc_per, gen_per, nom1_per, nom2_per, ape1_per, ape2_per, dir_per, cel_per, email_per;
    private Date fecha_nac_per;
    private Integer tipo_doc_id, mun_exp_doc_id, mun_res_per_id;

    public Persona() {
    }

    public Persona(String id_per, String num_doc_per, Integer tipo_doc_id, Integer mun_exp_doc_id, String gen_per,
                   String nom1_per, String nom2_per, String ape1_per, String ape2_per, String fecha_nac_per,
                   Integer mun_res_per_id, String dir_per, String cel_per, String email_per) throws NotFoundException {
        this.id_per = id_per;
        this.num_doc_per = num_doc_per;
        this.tipo_doc_id = tipo_doc_id;
        this.mun_exp_doc_id = mun_exp_doc_id;
        this.gen_per = gen_per;
        this.nom1_per = nom1_per;
        this.nom2_per = nom2_per;
        this.ape1_per = ape1_per;
        this.ape2_per = ape2_per;
        this.mun_res_per_id = mun_res_per_id;
        this.dir_per = dir_per;
        this.cel_per = cel_per;
        this.email_per = email_per;
        try {
            this.fecha_nac_per = (new SimpleDateFormat("yyyy-MM-dd")).parse(fecha_nac_per);
        } catch (ParseException E) {
            if (fecha_nac_per.length() > 0)
                throw new NotFoundException("Formato de fecha no valido", 400);
            else
                this.fecha_nac_per = null;
        }
    }

    public String getId_per() {
        return id_per;
    }

    public String getNum_doc_per() {
        return num_doc_per;
    }

    public Integer getTipo_doc_id() {
        return tipo_doc_id;
    }

    public Integer getMun_exp_doc_id() {
        return mun_exp_doc_id;
    }

    public String getGen_per() {
        return gen_per;
    }

    public String getNom1_per() {
        return nom1_per.toUpperCase();
    }

    public String getNom2_per() {
        return nom2_per.toUpperCase();
    }

    public String getApe1_per() {
        return ape1_per.toUpperCase();
    }

    public String getApe2_per() {
        return ape2_per.toUpperCase();
    }


    public java.sql.Date getFecha_nac_per() {
        try {
            java.sql.Date DBDate = java.sql.Date.valueOf(new SimpleDateFormat("yyyy-MM-dd").format(this.fecha_nac_per));
            return DBDate;
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Integer getMun_res_per_id() {
        return mun_res_per_id;
    }

    public String getDir_per() {
        return dir_per;
    }

    public String getCel_per() {
        return cel_per;
    }

    public String getEmail_per() {
        return email_per;
    }

    public void setId_per(String id_per) {
        this.id_per = id_per;
    }

    public void setNum_doc_per(String num_doc_per) {
        this.num_doc_per = num_doc_per;
    }

    public void setTipo_doc_id(Integer tipo_doc_id) {
        this.tipo_doc_id = tipo_doc_id;
    }

    public void setMun_exp_doc_id(Integer mun_exp_doc_id) {
        this.mun_exp_doc_id = mun_exp_doc_id;
    }

    public void setGen_per(String gen_per) {
        this.gen_per = gen_per;
    }

    public void setNom1_per(String nom1_per) {
        this.nom1_per = nom1_per;
    }

    public void setNom2_per(String nom2_per) {
        this.nom2_per = nom2_per;
    }

    public void setApe1_per(String ape1_per) {
        this.ape1_per = ape1_per;
    }

    public void setApe2_per(String ape2_per) {
        this.ape2_per = ape2_per;
    }

    public void setFecha_nac_per(String fecha_nac_per) throws NotFoundException {
        try {
            this.fecha_nac_per = (new SimpleDateFormat("yyyy-MM-dd")).parse(fecha_nac_per);
        } catch (ParseException E) {
            if (fecha_nac_per.length() > 0)
                throw new NotFoundException("Formato de fecha no valido", 400);
            else
                this.fecha_nac_per = null;
        }
    }

    public void setMun_res_per_id(Integer mun_res_per_id) {
        this.mun_res_per_id = mun_res_per_id;
    }

    public void setDir_per(String dir_per) {
        this.dir_per = dir_per;
    }

    public void setCel_per(String cel_per) {
        this.cel_per = cel_per;
    }

    public void setEmail_per(String email_per) {
        this.email_per = email_per;
    }

    public Boolean validate() throws NotFoundException {
        if (this.mun_exp_doc_id == null)
            throw new NotFoundException("Municipio de expedicion no valido: " + this.mun_exp_doc_id, 400);
        if (this.tipo_doc_id == null)
            throw new NotFoundException("Tipo documento no valido: " + this.tipo_doc_id, 400);
        if (this.mun_res_per_id == null)
            throw new NotFoundException("Municipio de residencia no valido: " + this.tipo_doc_id, 400);
        if (this.num_doc_per.length() < 4)
            throw new NotFoundException("Documento de expedicion muy corto: " + this.num_doc_per, 400);
        if (!this.gen_per.equals("M") && !this.gen_per.equals("F"))
            this.gen_per = null;
        if (this.nom1_per.length() < 2)
            throw new NotFoundException("El primer nombre es muy corto: " + this.nom1_per, 400);
        if (this.nom2_per.length() == 0)
            this.nom2_per = null;
        if (this.ape1_per.length() < 2)
            throw new NotFoundException("El primer apellido es muy corto: " + this.ape1_per, 400);
        if (this.ape2_per.length() == 0) this.ape2_per = null;
        if (this.dir_per.length() == 0) this.dir_per = null;
        if (this.cel_per.length() == 0) this.cel_per = null;
        if (this.email_per.length() == 0) this.email_per = null;

        return true;
    }

    public Persona save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_per.equals("") || this.id_per == null)
            return this.insert();
        else
            return this.update();
    }

    protected Persona insert() throws NotFoundException {
        String SQL = Database.QueryInsert("personas", FIELDS);
        this.setId_per(UUID.randomUUID().toString());
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.id_per);
            STMT.setString(2, this.num_doc_per);
            STMT.setInt(3, this.tipo_doc_id);
            STMT.setInt(4, this.mun_exp_doc_id);
            STMT.setString(5, this.gen_per);
            STMT.setString(6, this.getNom1_per());
            STMT.setString(7, this.getNom2_per());
            STMT.setString(8, this.getApe1_per());
            STMT.setString(9, this.getApe2_per());
            STMT.setDate(10, this.getFecha_nac_per());
            STMT.setInt(11, this.mun_res_per_id);
            STMT.setString(12, this.dir_per);
            STMT.setString(13, this.cel_per);
            STMT.setString(14, this.email_per);
            STMT.execute();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected Persona update() throws NotFoundException {
        String SQL = Database.QueryUpdate("personas", FIELDS, "id_per=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, this.id_per);
            STMT.setString(2, this.num_doc_per);
            STMT.setInt(3, this.tipo_doc_id);
            STMT.setInt(4, this.mun_exp_doc_id);
            STMT.setString(5, this.gen_per);
            STMT.setString(6, this.getNom1_per());
            STMT.setString(7, this.getNom2_per());
            STMT.setString(8, this.getApe1_per());
            STMT.setString(9, this.getApe2_per());
            STMT.setDate(10, this.getFecha_nac_per());
            STMT.setInt(11, this.mun_res_per_id);
            STMT.setString(12, this.dir_per);
            STMT.setString(13, this.cel_per);
            STMT.setString(14, this.email_per);
            STMT.setString(15, this.id_per);
            STMT.executeUpdate();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_per) throws NotFoundException {
        String SQL = Database.QueryDelete("personas", "id_per=?");
        if (id_per.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_per);
            STMT.execute();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }
}
