import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@WebServlet("/ServletRegist")
public class ServletRegist extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        request.setCharacterEncoding("utf-8");
        //前端数据
        String userName1 = request.getParameter("userName");
        String email1 =request.getParameter("email");
        String mobile1 =request.getParameter("mobile");
        String sex1 =request.getParameter("sex");
        String pwd1 =request.getParameter("pwd");


        PrintWriter out =response.getWriter();
        out.println(userName1);
//能传参数
        //   PrintWriter out =response.getWriter();
        // out.println(email1);\

        Connection conn = null;
        // Statement stamt=null;
        PreparedStatement pstat=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn= DriverManager.getConnection("jdbc:mysql://localhost:3306/sql_websave?useSSL=false&serverTimezone=Asia" +
                    "/Shanghai","root","Mo150905");

            String sql="insert into usersave(userName,email,mobile,sex,pwd) values(?,?,?,?,?)";
            pstat=conn.prepareStatement(sql);    //若是 stamt=conn.createStatement();
            pstat.setString(1,userName1);
            pstat.setString(2,email1);
            pstat.setString(3,mobile1);
            pstat.setString(4,sex1);
            pstat.setString(5,pwd1);

            pstat.executeUpdate();   //stamt.executeUpdate(sql)
            request.getRequestDispatcher("Regist.jsp").forward(request, response);


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
