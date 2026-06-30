// THE RIGHT WAY TO DO THIS!!!! (mostly... apart from the hardcoded string)
using (SqlConnection conn = new SqlConnection("Data Source=<datasource>; Initial Catalog=<catalog>; User Id=<userId>; Password=<password>; Encrypt=True; TrustServerCertificate=True;"))
{
    using (SqlCommand cmd = new SqlCommand("<sprocName>", conn))
    {
        cmd.CommandType = CommandType.StoredProcedure;

        // 3. Define the parameter explicitly as Structured
        SqlParameter myParam = cmd.Parameters.AddWithValue("@<udtParamNameFromSproc>", dt);
        myParam.SqlDbType = SqlDbType.Structured;
        myParam.TypeName = "dbo.<sprocName>"; // Must match your SQL Server Sproc name exactly

        conn.Open();
        cmd.ExecuteNonQuery();
    }
}