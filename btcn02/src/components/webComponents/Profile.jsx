import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useAuth } from "./Logging/AuthContext";
import { User, Mail, Phone, Calendar, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? formatDateForInput(user.dob) : "",
      });
    }
  }, [user]);

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Get token
      const savedUser = localStorage.getItem("user");
      let token = "";
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          token = userData.token || "";
        } catch {
          console.error("Error parsing user data");
        }
      }

      // Prepare data
      const updateData = {};
      if (formData.email.trim()) updateData.email = formData.email.trim();
      if (formData.phone.trim()) updateData.phone = formData.phone.trim();
      if (formData.dob.trim()) updateData.dob = formData.dob.trim();

      if (Object.keys(updateData).length === 0) {
        throw new Error("Vui lòng nhập thông tin cần cập nhật");
      }

      console.log("Sending update:", updateData);

      // Call API
      const response = await fetch(
        "https://34.124.214.214:2423/api/users/profile",
        {
          method: "PATCH",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "x-app-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseText = await response.text();
      console.log("API Response:", response.status, responseText);

      if (!response.ok) {
        let errorMessage = "Cập nhật thất bại";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch {
          if (response.status === 401) {
            errorMessage = "Phiên đăng nhập hết hạn";
            setTimeout(() => logout(), 2000);
          }
        }
        throw new Error(errorMessage);
      }

      // Update localStorage
      const updatedUser = {
        ...user,
        ...updateData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? formatDateForInput(user.dob) : "",
      });
    }
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Hồ sơ cá nhân</CardTitle>
          <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
                <p className="text-gray-500 text-sm">{user?.email || "Chưa có email"}</p>
              </div>
            </div>

            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                    </div>

                    {/* Username - Read only */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Tên đăng nhập
                      </Label>
                      <Input
                        id="username"
                        value={user?.username || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    {/* Email - Editable when isEditing is true */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={loading} // Chỉ disable khi đang loading
                        />
                      ) : (
                        <Input
                          id="email"
                          value={formData.email || "Chưa cập nhật"}
                          disabled
                          className="bg-gray-50"
                        />
                      )}
                    </div>

                    {/* Phone - Editable when isEditing is true */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0123 456 789"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={loading} // Chỉ disable khi đang loading
                        />
                      ) : (
                        <Input
                          id="phone"
                          value={formData.phone || "Chưa cập nhật"}
                          disabled
                          className="bg-gray-50"
                        />
                      )}
                    </div>

                    {/* Date of Birth - Editable when isEditing is true */}
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ngày sinh
                      </Label>
                      {isEditing ? (
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          disabled={loading} // Chỉ disable khi đang loading
                          max={new Date().toISOString().split("T")[0]}
                        />
                      ) : (
                        <Input
                          id="dob"
                          value={formData.dob || "Chưa cập nhật"}
                          disabled
                          className="bg-gray-50"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    {isEditing ? (
                      <>
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Lưu thay đổi
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                      >
                        Chỉnh sửa thông tin
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}