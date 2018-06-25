package core;

public class NotFoundResource extends Exception {

    private int status;
    private String message = "No message available", error = "Bad Request";

    public NotFoundResource(Throwable throwable) {
        super(throwable);
    }

    public NotFoundResource(String msg, Throwable throwable) {
        super(msg, throwable);
    }

    public NotFoundResource(String msg) {
        super(msg);
    }

    public NotFoundResource(String message, int status) {
        super();
        this.status = status;
        this.message = message;
    }

    public NotFoundResource(String message, int status, String error) {
        super();
        this.status = status;
        this.message = message;
        this.error = error;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public StackTraceElement[] getStackTrace() {
        return null;
    }

    @Override
    public String toString() {
        return this.getStatus() + " : " + this.getError();
    }
}