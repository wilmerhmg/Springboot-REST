package core;

import java.util.ArrayList;
import java.util.List;

public class Select2 {
    private Integer total = 0;
    private List<Object> data = new ArrayList<Object>();

    public Select2() {
    }

    public Select2(Integer total, List<Object> data) {
        this.total = total;
        this.data = data;
    }

    public Integer getTotal() {
        return total;
    }

    public List<Object> getData() {
        return data;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public void setData(List<Object> data) {
        this.data = data;
    }
}
