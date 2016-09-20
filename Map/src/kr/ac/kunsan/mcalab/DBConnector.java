package kr.ac.kunsan.mcalab;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import twitter4j.JSONArray;
import twitter4j.JSONException;
import twitter4j.JSONObject;

public class DBConnector {
  private static String url = "jdbc:mysql://localhost/twitter";
  private static String id = "root";
  private static String password = "3408";
  private static String sql = "SELECT * FROM random WHERE ? <= latitude && latitude<= ? && ? <= longitude && longitude <= ?";
 // private static String sql2 = "SELECT * FROM random WHERE content LIKE '% ? %'";
  private static Connection conn = null;
  
  public static JSONObject getTwitterJSON(String[ ] params) throws ClassNotFoundException, SQLException, JSONException {
    if(conn != null) {
      closeConnection(null);
    }
    Class.forName("com.mysql.jdbc.Driver");
    conn = DriverManager.getConnection(url, id, password);
    ResultSet rs = null;
    PreparedStatement pstmt = conn.prepareStatement(sql);
    // params : minLati, maxLati, minLong, maxLong
    pstmt.setString(1, params[0]);
    pstmt.setString(2, params[1]);
    pstmt.setString(3, params[2]);
    pstmt.setString(4, params[3]);
    
    rs = pstmt.executeQuery();
    
    JSONObject total = new JSONObject();
    JSONArray data = new JSONArray();
    JSONObject element;

    while (rs.next()) {
      element = new JSONObject();
      element.put("name", rs.getString("name"));
      //element.put("nationality",rs.getString("nationality"));
      element.put("latitude", rs.getString("latitude"));
      element.put("longitude", rs.getString("longitude"));
      element.put("content", rs.getString("content"));
      
      data.put(element);
    }
   
    total.put("data", data);
    rs.close();
    
    return total;
  }
  
  public static void closeConnection(ResultSet rs) {
    try {
      conn.close();
      conn = null;
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
  
//  public static void searchTwitter(String content){
//	  
//  }
}
