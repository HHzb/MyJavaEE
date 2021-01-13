import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/ServletLogin")
public class ServletLogin extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        //前端数据
        String email1 =request.getParameter("loginEmail");
        String pwd1 =request.getParameter("loginPwd");
        Connection conn = null;
        PreparedStatement pstat=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/sql_websave?useSSL=false&serverTimezone" +
                    "=Asia" +
                    "/Shanghai","root","Mo150905");
//判断该email数据库是否存在
            String sql1 ="select userName from usersave where email=? and pwd=?";
            pstat=conn.prepareStatement(sql1);
            pstat.setString(1,email1);
            pstat.setString(2,pwd1);
            ResultSet rs=pstat.executeQuery();
            if(rs.next()){
                request.getRequestDispatcher("Login.jsp").forward(request,response);
                  rs.close();
            }
            else{
                request.getRequestDispatcher("Regist.html").forward(request,response);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try{

                if(pstat !=null)
                    pstat.close();

                if(conn !=null)
                    conn.close();

            }catch(Exception e){
                e.printStackTrace();
            }


        }


    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        doPost(request,response);
    }
}

