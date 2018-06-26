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

    public static class Adapter {
        private String id;
        private String label;
        private String more;

        public Adapter() {

        }

        public Adapter(String id, String label, String more) {
            this.id = id;
            this.label = label;
            this.more = more;
        }

        public String getId() {
            return id;
        }

        public String getLabel() {
            return label;
        }

        public String getMore(){
            return more;
        }

        public void setId(String id) {
            this.id = id;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public void setMore(String more) {
            this.more = more;
        }
    }
}
