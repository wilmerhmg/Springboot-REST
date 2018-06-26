package models;

import core.*;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class TipoDocumento {
    private String[] FIELDS = {"id_tipo_doc", "nom_tipo_doc", "sigla_tipo_doc"};
    private String nom_tipo_doc, sigla_tipo_doc;
    private Integer id_tipo_doc;

    public TipoDocumento() {
    }

    public TipoDocumento(Integer id_tipo_doc, String nom_tipo_doc, String sigla_tipo_doc) {
        this.nom_tipo_doc = nom_tipo_doc;
        this.sigla_tipo_doc = sigla_tipo_doc;
        this.id_tipo_doc = id_tipo_doc;
    }

    public String getNom_tipo_doc() {
        return nom_tipo_doc != null ? nom_tipo_doc.toUpperCase() : null;
    }

    public String getSigla_tipo_doc() {
        return sigla_tipo_doc != null ? sigla_tipo_doc.toUpperCase() : null;
    }

    public Integer getId_tipo_doc() {
        return id_tipo_doc > 0 ? id_tipo_doc : null;
    }

    public void setNom_tipo_doc(String nom_tipo_doc) {
        this.nom_tipo_doc = nom_tipo_doc;
    }

    public void setSigla_tipo_doc(String sigla_tipo_doc) {
        this.sigla_tipo_doc = sigla_tipo_doc;
    }

    public void setId_tipo_doc(Integer id_tipo_doc) {
        this.id_tipo_doc = id_tipo_doc;
    }

    public Boolean validate() throws NotFoundException {
        if (this.nom_tipo_doc.length() < 4 || this.nom_tipo_doc == null)
            throw new NotFoundException("Descripcion del tipo documento muy corto: " + this.nom_tipo_doc, 400);
        return true;
    }

    public TipoDocumento save() throws NotFoundException {
        if (!this.validate()) return null;
        if (this.id_tipo_doc == null || this.id_tipo_doc == 0)
            return this.insert();
        else
            return this.update();
    }

    protected TipoDocumento insert() throws NotFoundException {
        String SQL = Database.QueryInsert("aux_tipodoc", FIELDS);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            ResultSet Response = null;
            STMT.setString(1, null);
            STMT.setString(2, this.getNom_tipo_doc());
            STMT.setString(3, this.getSigla_tipo_doc());
            STMT.execute();
            STMT.close();
            STMT = Constants.DB.prepareStatement("SELECT LAST_INSERT_ID() AS NEW_ID");
            Response = STMT.executeQuery();
            if (Response.next())
                this.setId_tipo_doc(Response.getInt("NEW_ID"));
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    protected TipoDocumento update() throws NotFoundException {
        String SQL = Database.QueryUpdate("aux_tipodoc", FIELDS, "id_tipo_doc=?");
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, this.getId_tipo_doc());
            STMT.setString(2, this.getNom_tipo_doc());
            STMT.setString(3, this.getSigla_tipo_doc());
            STMT.setInt(4, this.getId_tipo_doc());
            STMT.executeUpdate();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return this;
    }

    public Boolean delete(String id_tipo_doc) throws NotFoundException {
        String SQL = Database.QueryDelete("aux_tipodoc", "id_tipo_doc=?");
        if (id_tipo_doc.equals("")) throw new NotFoundException("Se requiere valor identificador", 400);
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, id_tipo_doc);
            STMT.execute();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
        return true;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            PreparedStatement STMT = Constants.DB.prepareStatement("SELECT * FROM aux_tipodoc WHERE id_tipo_doc=? LIMIT 1");
            ResultSet Response = null;
            STMT.setInt(1, this.getId_tipo_doc());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId_tipo_doc(Response.getInt("id_tipo_doc"));
                this.setNom_tipo_doc(Response.getString("nom_tipo_doc"));
                this.setSigla_tipo_doc(Response.getString("sigla_tipo_doc"));
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
        List<Object> TipoDocs = new ArrayList<>();
        Paginator BindData = new Paginator();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS * FROM aux_tipodoc LIMIT ?,40";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setInt(1, Page);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                TipoDocumento TIPO = new TipoDocumento();
                TIPO.setId_tipo_doc(Response.getInt("id_tipo_doc"));
                TIPO.setNom_tipo_doc(Response.getString("nom_tipo_doc"));
                TIPO.setSigla_tipo_doc(Response.getString("sigla_tipo_doc"));
                TipoDocs.add(TIPO);
            }

            Response.close();
            STMT.close();

            BindData.setRows(TipoDocs);
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