package core;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static String SERVER = "localhost";
    private static String PORT = "3306";
    private static String USERDB = "asd";
    private static String PWDBD = "WEYzEsTMYvgKl5JOWblJ";
    private static String DB = "inventario";

    public Database() {
    }

    public static Connection getConexion() {
        Connection DBConexion = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String servidor = "jdbc:mysql://" + SERVER + ":" + PORT + "/" + DB;
            DBConexion = DriverManager.getConnection(servidor, USERDB, PWDBD);

        } catch (ClassNotFoundException ex) {
            System.out.println("No Se Realizo La Conexión Clase No Encontrada");
        } catch (SQLException ex) {
            System.out.println("No Se Realizo La Conexión, Errores en valores de conexion");
        }
        return DBConexion;
    }

    public static String QueryUpdate(String TABLE, String[] FIELDS, String WHERE) {
        String[] QueryBulid = {"UPDATE", TABLE, "SET", String.join("=?,", FIELDS) + "=?", "WHERE", WHERE};
        return String.join(" ", QueryBulid);
    }

    public static String QueryInsert(String TABLE, String[] FIELDS) {
        String[] Stamets = new String[FIELDS.length];
        for (int i = 0; i < FIELDS.length; i++) {
            Stamets[i] = "?";
        }

        String[] QueryBuild = {"INSERT", "INTO", TABLE, "(", String.join(",", FIELDS), ")VALUES(",
                String.join(",", Stamets), ")"};

        return String.join(" ", QueryBuild);
    }

    public static String QueryDelete(String TABLE, String WHERE) {
        String[] QueryBuild = {"DELETE", "FROM", TABLE,"WHERE", WHERE};
        return String.join(" ", QueryBuild);
    }
}
