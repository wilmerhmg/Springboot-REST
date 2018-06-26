package models;

import core.Constants;
import core.NotFoundException;
import core.NotFoundResource;
import core.Select2;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Divipol {
    private Integer id;
    private String nom_mpio, nom_depto;

    public Divipol() {
    }

    public Divipol(Integer id, String nom_mpio, String nom_depto) {
        this.id = id;
        this.nom_mpio = nom_mpio;
        this.nom_depto = nom_depto;
    }

    public Integer getId() {
        return id;
    }

    public String getNom_mpio() {
        return nom_mpio;
    }

    public String getNom_depto() {
        return nom_depto;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNom_mpio(String nom_mpio) {
        this.nom_mpio = nom_mpio;
    }

    public void setNom_depto(String nom_depto) {
        this.nom_depto = nom_depto;
    }

    public void load() throws NotFoundResource, NotFoundException {
        try {
            String SQL = "SELECT aux_mpio.id_mpio AS id, aux_mpio.nom_mpio, aux_dpto.nom_depto\n" +
                    "FROM aux_mpio INNER JOIN aux_dpto ON (aux_mpio.depto_id = aux_dpto.id_depto) WHERE id_mpio=?";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            ResultSet Response = null;
            STMT.setInt(1, this.getId());
            Response = STMT.executeQuery();
            if (Response.next()) {
                this.setId(Response.getInt("id"));
                this.setNom_mpio(Response.getString("nom_mpio"));
                this.setNom_depto(Response.getString("nom_depto"));
            } else {
                throw new NotFoundResource("Sin resultados", 404, "Not Found");
            }
            Response.close();
            STMT.close();
        } catch (SQLException e) {
            throw new NotFoundException(e.getMessage(), e.getErrorCode());
        }
    }

    public static Select2 find(Integer p, String q) {
        Select2 BindData = new Select2();
        Integer Pag = 10 * (p - 1);
        List<Object> MPIOS = new ArrayList<>();
        try {
            String SQL = "SELECT SQL_CALC_FOUND_ROWS aux_mpio.id_mpio, aux_mpio.nom_mpio, aux_dpto.nom_depto " +
                    "FROM aux_mpio INNER JOIN aux_dpto ON (aux_mpio.depto_id = aux_dpto.id_depto) " +
                    "WHERE (aux_mpio.nom_mpio LIKE ? ) OR (aux_dpto.nom_depto LIKE ?) ORDER BY aux_mpio.nom_mpio LIMIT ?,10";
            PreparedStatement STMT = Constants.DB.prepareStatement(SQL);
            STMT.setString(1, "%" + q + "%");
            STMT.setString(2, "%" + q + "%");
            STMT.setInt(3, Pag);
            ResultSet Response = null;
            Response = STMT.executeQuery();
            while (Response.next()) {
                Divipol MPIO = new Divipol();
                MPIO.setId(Response.getInt("id_mpio"));
                MPIO.setNom_mpio(Response.getString("nom_mpio"));
                MPIO.setNom_depto(Response.getString("nom_depto"));
                MPIOS.add(MPIO);
            }

            Response.close();
            STMT.close();

            BindData.setData(MPIOS);
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
