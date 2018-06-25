package core;

import java.util.ArrayList;
import java.util.List;

public class Paginator {
    private Integer Total = 0;
    private Integer Page = 0;
    private List<Object> Rows = new ArrayList<Object>();

    public Paginator() {
    }

    public Paginator(Integer total, Integer page, List<Object> rows) {
        Total = total;
        Page = page;
        Rows = rows;
    }

    public Integer getTotal() {
        return Total;
    }

    public Integer getPage() {
        return Page;
    }

    public List<Object> getRows() {
        return Rows;
    }

    public void setTotal(Integer total) {
        Total = total;
    }

    public void setPage(Integer page) {
        Page = page;
    }

    public void setRows(List<Object> rows) {
        Rows = rows;
    }
}
