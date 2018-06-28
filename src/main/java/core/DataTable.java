package core;

import java.util.ArrayList;
import java.util.List;

public class DataTable {
    private Integer draw = 1;
    private Integer recordsFiltered = 0;
    private Integer recordsTotal;
    private List<Object> data = new ArrayList<>();

    public DataTable() {
    }

    public DataTable(Integer draw, Integer recordsFiltered, Integer recordsTotal, List<Object> data) {
        this.draw = draw;
        this.recordsFiltered = recordsFiltered;
        this.recordsTotal = recordsTotal;
        this.data = data;
    }

    public Integer getDraw() {
        return draw;
    }

    public Integer getRecordsFiltered() {
        return recordsFiltered;
    }

    public Integer getRecordsTotal() {
        return recordsTotal;
    }

    public List<Object> getData() {
        return data;
    }

    public void setDraw(Integer draw) {
        this.draw = draw;
    }

    public void setRecordsFiltered(Integer recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

    public void setRecordsTotal(Integer recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public void setData(List<Object> data) {
        this.data = data;
    }

    public static String BuildExp(String[] FIELDS, String Search, Boolean WH) {
        String EXP = "(CONCAT_WS(' '," + String.join(",", FIELDS) + ") REGEXP ?)";
        EXP = WH ? "WHERE " + EXP : " AND "+EXP;
        return Search.replace(" ", "").length() > 0 ? EXP : "";
    }

    public static String PrepareExp(String Search) {
        String Regular_EXP;
        Regular_EXP = Search.trim()
                .replace("\\", "")
                .replace("|", "")
                .replace(" ", ".+");
        return Regular_EXP;
    }

    public static String CustomFilter(String WHERE, Integer Value, Boolean WH) {
        return (Value != null && Value > 0) ? (((WH) ? "WHERE " : "") + WHERE + " ") : "";
    }
}
