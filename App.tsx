// App.js (Combined Student + Teacher with Role Toggle Login)
// Paste over your existing App.js
import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
  FlatList,
  Modal,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LineChart } from 'react-native-chart-kit';
import { launchCamera } from 'react-native-image-picker';

const screenWidth = Dimensions.get('window').width - 32;

/* ---------- Student pieces ---------- */
const StudentStack = createNativeStackNavigator();
const StudentTab = createBottomTabNavigator();

function AttendanceDashboard({ attendance = 45, weeklyData = [65, 55, 70, 40, 80, 30, 75] }) {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Attendance Trend</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.percentBig}>{attendance}%</Text>
            <Text style={styles.subText}>Last 7 Days <Text style={{ color: '#e74c3c' }}>▼50%</Text></Text>
          </View>
        </View>

        <LineChart
          data={{ labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets:[{data: weeklyData}] }}
          width={screenWidth}
          height={160}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(10,132,255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
            propsForDots: { r:'3', strokeWidth:'2', stroke:'#0A84FF' },
          }}
          bezier
          style={{ marginTop: 12, borderRadius: 8 }}
          withInnerLines={false}
          withVerticalLines={false}
        />
      </View>
    </View>
  );
}

function DashboardScreenStudent() {
  const attendance = 45;
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>LNCT</Text>
          <TouchableOpacity><Text style={{ fontSize: 20 }}>🔔</Text></TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Image source={{ uri: 'https://i.pravatar.cc/300?img=12' }} style={styles.avatar} />
          <Text style={styles.name}>Arjun Sharma</Text>
          <Text style={styles.sub}>Section:G  | Roll No: 45</Text>
        </View>

        <View style={styles.attCard}>
          <Text style={styles.attLabel}>Overall Attendance</Text>
          <View style={styles.ringWrap}>
            <View style={styles.ringGrey} />
            <View style={[styles.ringColored, { transform: [{ rotate: `${(attendance / 100) * 360}deg` }] }]} />
            <View style={styles.centerCircle}><Text style={styles.percentText}>{attendance}%</Text></View>
          </View>
        </View>

        <View style={styles.warnCard}>
          <Text style={styles.warnTitle}>Defaulter Warning!</Text>
          <Text style={styles.warnText}>Your attendance is critically low. Immediate improvement is required.</Text>
        </View>

        <AttendanceDashboard attendance={attendance} weeklyData={[60, 50, 55, 45, 70, 30, 65]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const attendanceTableData = [
  { id: '1', date: '20\nAug\n2025', dateRaw: '2025-08-20', period: '7', subject: 'PYTHON-P', status: 'A' },
  { id: '2', date: '20\nAug\n2025', dateRaw: '2025-08-20', period: '3', subject: 'CYBER SECURITY', status: 'P' },
  { id: '3', date: '20\nAug\n2025', dateRaw: '2025-08-20', period: '4', subject: 'DBMS', status: 'P' },
  { id: '4', date: '20\nAug\n2025', dateRaw: '2025-08-20', period: '5', subject: 'DBMS', status: 'A' },
  { id: '5', date: '20\nAug\n2025', dateRaw: '2025-08-20', period: '6', subject: 'THEORY OF COMPUTER', status: 'A' },
  { id: '6', date: '19\nAug\n2025', dateRaw: '2025-08-19', period: '2', subject: 'PYTHON-P', status: 'P' },
  { id: '7', date: '18\nAug\n2025', dateRaw: '2025-08-18', period: '1', subject: 'ENGLISH', status: 'P' },
  { id: '8', date: '17\nAug\n2025', dateRaw: '2025-08-17', period: '7', subject: 'DBMS', status: 'P' },
];

function AttendanceRecordsScreen() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('--All--');

  const subjects = useMemo(() => {
    const set = new Set(attendanceTableData.map(r => r.subject));
    return ['--All--', ...Array.from(set)];
  }, []);

  const filteredData = useMemo(() => {
    if (selectedSubject === '--All--') return attendanceTableData;
    return attendanceTableData.filter(r => r.subject === selectedSubject);
  }, [selectedSubject]);

  const renderRow = ({ item, index }) => {
    const even = index % 2 === 0;
    const statusColor = item.status === 'A' ? '#e74c3c' : '#27ae60';
    return (
      <View style={[styles.tableRow, even ? styles.rowEven : styles.rowOdd]}>
        <View style={[styles.colSr]}>
          <Text style={styles.cellText}>{index + 1}</Text>
        </View>

        <View style={[styles.colDate]}>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.colPeriod}>
          <Text style={styles.cellText}>{item.period}</Text>
        </View>

        <View style={styles.colSubject}>
          <Text style={[styles.cellText, { fontWeight: '700' }]} numberOfLines={1}>{item.subject}</Text>
        </View>

        <View style={styles.colStatus}>
          <Text style={[styles.cellText, { color: statusColor, fontWeight: '700' }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom:12 }}>
          <TouchableOpacity onPress={() => {}}><Text style={{ fontSize:20, marginRight:12 }}>◀</Text></TouchableOpacity>
          <Text style={[styles.h1, { flex:1 }]}>Attendance Records Date Wise</Text>
          <View style={{ width:32 }} />
        </View>

        <Text style={{ color: '#666', marginBottom: 6 }}>Subject :</Text>

        <TouchableOpacity style={styles.dropdown} onPress={() => setFilterModalVisible(true)}>
          <Text style={{ color: selectedSubject === '--All--' ? '#666' : '#111' }}>{selectedSubject}</Text>
          <Text style={{ fontSize:18 }}>▾</Text>
        </TouchableOpacity>

        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.colSr}><Text style={styles.headerText}>Sr.No.</Text></View>
          <View style={styles.colDate}><Text style={styles.headerText}>Date</Text></View>
          <View style={styles.colPeriod}><Text style={styles.headerText}>Period No.</Text></View>
          <View style={styles.colSubject}><Text style={styles.headerText}>Subject</Text></View>
          <View style={styles.colStatus}><Text style={styles.headerText}>Attendance Status</Text></View>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderRow}
          contentContainerStyle={{ paddingBottom: 60 }}
        />

        <Modal visible={filterModalVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
            <View style={styles.modalContent}>
              {subjects.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.modalItem}
                  onPress={() => { setSelectedSubject(s); setFilterModalVisible(false); }}
                >
                  <Text style={{ color: s === selectedSubject ? '#0A84FF' : '#111' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function SubjectWiseScreen() {
  const subjects = [
    { name: 'DBMS', pct: 50, color: '#ff6b6b' },
    { name: 'TOC', pct: 60, color: '#ff7f50' },
    { name: 'CYBER SECURITY', pct: 35, color: '#ffa500' },
    { name: 'IWT', pct: 45, color: '#ffd166' },
    { name: 'PYHTON', pct: 40, color: '#ff6b6b' },
  ];
  const overall = 45;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom:6 }}>
          <TouchableOpacity onPress={() => {}}><Text style={{ fontSize:20, marginRight:12 }}>◀</Text></TouchableOpacity>
          <Text style={[styles.h1, { flex:1, textAlign:'center' }]}>Subject Wise Attendance</Text>
          <View style={{ width:32 }} />
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <View>
              <Text style={{ fontSize:22, fontWeight:'700' }}>{overall}%</Text>
              <Text style={{ color:'#888', fontSize:12 }}>Overall Attendance</Text>
            </View>
            <View style={{ backgroundColor:'#fee', paddingHorizontal:8, paddingVertical:6, borderRadius:16 }}>
              <Text style={{ color:'#e74c3c' }}>▼ -10%</Text>
            </View>
          </View>

          <View style={{ marginTop:16 }}>
            {subjects.map(s => (
              <View key={s.name} style={{ marginBottom:12 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                  <Text style={{ fontWeight:'700' }}>{s.name}</Text>
                  <Text style={{ color:'#555' }}>{s.pct}%</Text>
                </View>
                <View style={{ height:14, backgroundColor:'#eee', borderRadius:14, overflow:'hidden' }}>
                  <View style={{ width: `${s.pct}%`, height:'100%', backgroundColor:s.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={{ fontWeight:'700', marginBottom:8 }}>Prediction to Reach Target (75%)</Text>
          <Text style={{ color:'#c0392b', fontWeight:'700', marginBottom:6 }}>Significant Improvement Needed</Text>
          <Text style={{ color:'#555', marginBottom:8 }}>
            Your overall attendance is projected to be 55%. You are at high risk of not meeting the attendance requirements.
          </Text>

          <Text style={{ fontWeight:'700', marginBottom:6 }}>Action Required For All Subjects</Text>
          <Text style={{ color:'#555' }}>
            To reach the 75% target, you need to attend the next 15 classes for Math, 18 for Science, 12 for History, 8 for English, and 15 for Art.
          </Text>

          <View style={{ marginTop:12 }}>
            <View style={{ height:10, backgroundColor:'#eee', borderRadius:10 }}>
              <View style={{ width:'45%', height:'100%', backgroundColor:'#ff6b6b', borderRadius:10 }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Student settings — now accepts onLogout prop and calls it to redirect to login */
function SettingsScreen({ onLogout }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => onLogout && onLogout() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.h1, { marginBottom: 12 }]}>Settings</Text>

        <View style={styles.card}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Preferences</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ fontWeight: '700' }}>Notifications</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>Receive attendance updates & alerts</Text>
            </View>
            <TouchableOpacity onPress={() => setNotificationsEnabled(v => !v)}>
              <Text>{notificationsEnabled ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontWeight: '700' }}>Dark Mode</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>Toggle app theme (UI only)</Text>
            </View>
            <TouchableOpacity onPress={() => setDarkModeEnabled(v => !v)}>
              <Text>{darkModeEnabled ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>App Info</Text>
          <Text style={{ color: '#666', marginBottom: 8 }}>Version 1.0.0</Text>
          <Text style={{ color: '#666', marginBottom: 12 }}>Support: support@example.com</Text>
        </View>

        <TouchableOpacity style={[styles.raiseButton, { marginTop: 24 }]} onPress={handleLogout}>
          <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* Attendance Stack for Student */
function AttendanceStack() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="Records" component={AttendanceRecordsScreen} />
      <StudentStack.Screen name="RaiseQuery" component={({route,navigation})=> <RaiseQueryScreen route={route} navigation={navigation} />} />
    </StudentStack.Navigator>
  );
}

function RaiseQueryScreen({ route }) {
  const subject = route.params?.subject ?? 'Subject';
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ padding: 16 }}>
        <Text style={styles.h1}>Raise Query</Text>
        <Text style={{ marginTop: 12 }}>Query for <Text style={{ fontWeight: '700' }}>{subject}</Text></Text>
        <TouchableOpacity style={[styles.raiseButton, { marginTop: 24 }]} onPress={() => alert('Query submitted')}>
          <Text style={{ color:'#fff', fontWeight:'700' }}>Submit Query</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* Student Main Tabs — receives onLogout prop from top-level App and forwards to SettingsScreen */
function StudentMainTabs({ onLogout }) {
  return (
    <StudentTab.Navigator screenOptions={{ headerShown:false }}>
      <StudentTab.Screen name="Dashboard" component={DashboardScreenStudent} options={{ tabBarLabel: 'Dashboard' }} />
      <StudentTab.Screen name="Attendance" component={AttendanceStack} options={{ tabBarLabel: 'Attendance' }} />
      <StudentTab.Screen name="SubjectWise" component={SubjectWiseScreen} options={{ tabBarLabel: 'Subject Wise Attendance' }} />
      <StudentTab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} onLogout={onLogout} />}
      </StudentTab.Screen>
    </StudentTab.Navigator>
  );
}

/* ---------- Teacher pieces (unchanged behavior) ---------- */
const baseStudents = {
  '3A': [
    { id: 's1', name: 'Alice Johnson', roll: 1, present: true },
    { id: 's2', name: 'Bob Smith', roll: 2, present: false },
  ],
  '3B': [
    { id: 's3', name: 'Charlie Brown', roll: 1, present: true },
    { id: 's4', name: 'Diana Prince', roll: 2, present: true },
  ],
  '3C': [
    { id: 's5', name: 'Ethan Harper', roll: 1, present: true },
    { id: 's6', name: 'Fiona Glenanne', roll: 2, present: false },
  ],
};

const teacherProfile = {
  name: 'Mr. John Doe',
  subject: 'Mathematics',
  email: 'johndoe@school.edu',
  phone: '+1 555-123-4567',
  school: 'Greenfield College',
  employeeId: 'T-2025-009',
  joinDate: '01 Jan, 2020',
  officeRoom: 'Block B, Room 12',
};

const toDateKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const formatNice = (d) => {
  const opts = { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString(undefined, opts);
};

function TeacherTab({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tab}>
      <Text style={[styles.tabText, active ? styles.tabActiveText : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Teacher screens follow the same implementation as earlier (kept intact) */
/* -- SessionScreenTeacher, OnlineAttendanceTeacher, OfflineAttendanceTeacher, ClassAttendanceScreen,
   StudentsScreenTeacher, QueriesScreenTeacher, ProfileScreenTeacher, TeacherApp --
   For brevity they are the same as your code above (left unchanged). */
/* To keep response focused and complete, I include them here exactly as previously provided (unchanged) */

function SessionScreenTeacher({ onEnd, durationSeconds = 60, subject, mode = 'online', navigate }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  useEffect(() => {
    setRemaining(durationSeconds);
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          Alert.alert('Session ended', 'Attendance session has finished.');
          onEnd && onEnd();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [durationSeconds, onEnd]);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Stop', 'Session stopped.');
            onEnd && onEnd();
          }}
          style={styles.headerLeft}
        >
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mode === 'online' ? 'Online Attendance' : 'Offline Attendance'}</Text>
        <Text style={styles.headerIcon}>⚙</Text>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <Text style={{ color: '#666', marginBottom: 12 }}>Session ends in:</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.timerBox}>
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{pad(minutes)}</Text>
            <Text style={{ color: '#666', marginTop: 6 }}>Minutes</Text>
          </View>

          <Text style={{ fontSize: 28, marginHorizontal: 8 }}>:</Text>

          <View style={styles.timerBox}>
            <Text style={{ fontSize: 28, fontWeight: '700' }}>{pad(seconds)}</Text>
            <Text style={{ color: '#666', marginTop: 6 }}>Seconds</Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={styles.bigCircle}>
            <View style={styles.smallCircle}>
              <Text style={{ fontSize: 24, color: '#fff' }}>🎥</Text>
            </View>
          </View>
        </View>

        <Text style={{ color: '#666', marginTop: 20 }}>Camera is active and taking attendance.</Text>

        <Pressable
          style={[styles.stopBtn, { marginTop: 30 }]}
          onPress={() => {
            Alert.alert('Stopped', 'You stopped the session.');
            onEnd && onEnd();
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Stop Session</Text>
        </Pressable>
      </View>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

function OnlineAttendanceTeacher({ onBack, preselectedSubject, onStartSession, navigate }) {
  const [selectedSubject, setSelectedSubject] = useState(preselectedSubject || null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const sampleSubjects = ['Mathematics', 'Science', 'English'];
  const sampleClasses = ['3A', '3B', '3C'];
  const sampleBranches = ['Main Campus', 'City Campus', 'West Campus'];

  const handleUpload = () => {
    if (imageUri) {
      setImageUri(null);
      Alert.alert('Image removed');
    } else {
      setImageUri('https://via.placeholder.com/400x250');
      Alert.alert('Image uploaded (simulated)');
    }
  };

  const startAttendance = () => {
    if (!selectedSubject || !selectedClass || !selectedBranch) {
      Alert.alert('Missing info', 'Please select subject, class and branch before starting attendance.');
      return;
    }
    if (typeof onStartSession === 'function') {
      onStartSession(60, { subject: selectedSubject, class: selectedClass, branch: selectedBranch, mode: 'online' });
    } else {
      Alert.alert('Session (demo)', `${selectedSubject} | ${selectedClass} | ${selectedBranch}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerIcon}>⚙</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <Pressable
          style={styles.selectRow}
          onPress={() => {
            const next = sampleSubjects[(sampleSubjects.indexOf(selectedSubject || '') + 1) % sampleSubjects.length] || sampleSubjects[0];
            setSelectedSubject(next);
          }}
        >
          <Text style={styles.selectText}>{selectedSubject || 'Subject'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <Pressable
          style={styles.selectRow}
          onPress={() => {
            const next = sampleClasses[(sampleClasses.indexOf(selectedClass || '') + 1) % sampleClasses.length] || sampleClasses[0];
            setSelectedClass(next);
          }}
        >
          <Text style={styles.selectText}>{selectedClass || 'Class'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <Pressable
          style={styles.selectRow}
          onPress={() => {
            const next = sampleBranches[(sampleBranches.indexOf(selectedBranch || '') + 1) % sampleBranches.length] || sampleBranches[0];
            setSelectedBranch(next);
          }}
        >
          <Text style={styles.selectText}>{selectedBranch || 'Select Branch'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <View style={styles.uploadBox}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>📷</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 10 }}>Add Image for AI Attendance</Text>
            <Text style={{ fontSize: 13, color: '#666', marginTop: 4, textAlign: 'center' }}>
              Upload a photo of the class for automatic marking.
            </Text>

            {imageUri ? <Text style={{ marginTop: 8, color: '#7A7A7A' }}>Preview image set</Text> : null}

            <Pressable style={styles.uploadBtn} onPress={handleUpload}>
              <Text style={styles.uploadBtnText}>{imageUri ? 'Remove Image' : 'Upload Image'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.startSessionBtn} onPress={startAttendance}>
          <Text style={styles.startSessionText}>Start Attendance</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

function OfflineAttendanceTeacher({ onBack, preselectedSubject, onStartSession, navigate }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(preselectedSubject || null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const sampleBranches = ['Main Campus', 'City Campus', 'West Campus'];

  const handleStartSession = () => {
    if (!selectedClass || !selectedSubject || !selectedBuilding || !selectedBranch) {
      Alert.alert('Missing info', 'Select class, subject, branch and building first.');
      return;
    }

    const durationSeconds = 10 * 60;
    const params = {
      subject: selectedSubject,
      class: selectedClass,
      branch: selectedBranch,
      building: selectedBuilding,
      mode: 'offline',
    };

    if (typeof onStartSession === 'function') {
      onStartSession(durationSeconds, params);
    } else {
      Alert.alert('Session started (demo)', `${selectedClass} | ${selectedSubject} | ${selectedBranch} | ${selectedBuilding}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Attendance</Text>
        <Text style={styles.headerIcon}>⚙</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <Pressable style={styles.selectRow} onPress={() => setSelectedClass('3A')}>
          <Text style={styles.selectText}>{selectedClass || 'Select Class'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <Pressable style={styles.selectRow} onPress={() => setSelectedSubject('Mathematics')}>
          <Text style={styles.selectText}>{selectedSubject || 'Select Subject'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <Pressable
          style={styles.selectRow}
          onPress={() => {
            const next = sampleBranches[(sampleBranches.indexOf(selectedBranch || '') + 1) % sampleBranches.length] || sampleBranches[0];
            setSelectedBranch(next);
          }}
        >
          <Text style={styles.selectText}>{selectedBranch || 'Select Branch'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <Pressable style={styles.selectRow} onPress={() => setSelectedBuilding('Block A')}>
          <Text style={styles.selectText}>{selectedBuilding || 'Select Building'}</Text>
          <Text style={styles.selectChevron}>v</Text>
        </Pressable>

        <View style={[styles.selectRow, { backgroundColor: '#fff', borderWidth: 0 }]}>
          <Text style={[styles.selectText, { color: '#7A7A7A' }]}>Room Name/Camera Example F-17</Text>
        </View>

        <Pressable style={styles.startSessionBtn} onPress={handleStartSession}>
          <Text style={styles.startSessionText}>Start Session</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

function ClassAttendanceScreen({
  classId,
  classTitle,
  students,
  onBack,
  onSave,
  navigate,
  initialDateKey,
}) {
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDateKey) {
      const parts = initialDateKey.split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return new Date();
  });

  const [list, setList] = useState(students ? students.map((s) => ({ ...s })) : []);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setList(students ? students.map((s) => ({ ...s })) : []);
  }, [students]);

  const dateKey = toDateKey(selectedDate);

  const togglePresent = (studentId, value) => {
    setList((prev) => prev.map((s) => (s.id === studentId ? { ...s, present: value } : s)));
  };

  const handleSave = () => {
    onSave && onSave(classId, dateKey, list);
    Alert.alert('Saved', `Attendance saved for ${formatNice(selectedDate)}`);
    onBack && onBack();
  };

  const changeDateBy = (days) => {
    setSelectedDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + days);
      return nd;
    });
    setDateModalVisible(false);
  };
  const pickToday = () => {
    setSelectedDate(new Date());
    setDateModalVisible(false);
  };

  const filteredList = list.filter((stu) => {
    if (!search || !search.trim()) return true;
    const q = search.trim().toLowerCase();
    const nameMatch = (stu.name || '').toLowerCase().includes(q);
    const rollMatch = String(stu.roll || '').toLowerCase().includes(q);
    return nameMatch || rollMatch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{classTitle} Attendance</Text>
        <Text style={styles.headerIcon}>⋮</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <Pressable style={styles.datePill} onPress={() => setDateModalVisible(true)}>
          <Text style={{ fontWeight: '700' }}>📅 {formatNice(selectedDate)}</Text>
        </Pressable>

        <View style={{ marginTop: 12 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search student by name or roll..."
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e6e6e6',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {filteredList.map((stu) => (
          <View key={stu.id} style={styles.studentRow}>
            <View style={styles.avatarPlaceholder}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
                {stu.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>{stu.name}</Text>
              <Text style={{ color: '#2F72E6', marginTop: 4 }}>Roll No: {stu.roll}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => togglePresent(stu.id, true)}
                style={[
                  styles.presentBtn,
                  stu.present ? styles.presentBtnActive : styles.presentBtnInactive,
                ]}
              >
                <Text style={[styles.presentText, stu.present ? styles.presentTextActive : null]}>Present</Text>
              </Pressable>

              <Pressable
                onPress={() => togglePresent(stu.id, false)}
                style={[
                  styles.absentBtn,
                  !stu.present ? styles.absentBtnActive : styles.absentBtnInactive,
                ]}
              >
                <Text style={[styles.absentText, !stu.present ? styles.absentTextActive : null]}>Absent</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {filteredList.length === 0 && (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#7A7A7A' }}>No students match your search.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.updateWrapper}>
        <TouchableOpacity style={styles.updateBtn} activeOpacity={0.9} onPress={handleSave}>
          <Text style={styles.updateText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>

      <Modal visible={dateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 12 }}>Select Date</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
              <Pressable onPress={() => changeDateBy(-1)} style={styles.modalBtn}>
                <Text>{'<'}</Text>
              </Pressable>

              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: '700' }}>{formatNice(selectedDate)}</Text>
                <Text style={{ color: '#7A7A7A', marginTop: 6 }}>{dateKey}</Text>
              </View>

              <Pressable onPress={() => changeDateBy(1)} style={styles.modalBtn}>
                <Text>{'>'}</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Pressable onPress={pickToday} style={[styles.modalAction, { flex: 1, marginRight: 8 }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Today</Text>
              </Pressable>

              <Pressable onPress={() => setDateModalVisible(false)} style={[styles.modalActionAlt, { flex: 1, marginLeft: 8 }]}>
                <Text style={{ fontWeight: '700' }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StudentsScreenTeacher({ onBack, navigate, classesList = [], onAddClass, onSelectClass }) {
  const [selected, setSelected] = useState(classesList.length ? classesList[0].id : null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [yearInput, setYearInput] = useState('');
  const [sectionInput, setSectionInput] = useState('');
  const [studentCountInput, setStudentCountInput] = useState('0');

  useEffect(() => {
    if (!selected && classesList.length) setSelected(classesList[0].id);
  }, [classesList]);

  const handleCardPress = (item) => {
    if (!item || item.id === 'add') {
      setAddModalVisible(true);
      return;
    }
    setSelected(item.id);
    onSelectClass && onSelectClass(item.id);
  };

  const handleSubmitAdd = () => {
    const year = yearInput.trim();
    const section = sectionInput.trim().toUpperCase();
    const studentCount = Number(studentCountInput) || 0;

    if (!/^\d+$/.test(year)) {
      Alert.alert('Invalid input', 'Year must be a number (e.g. 3).');
      return;
    }
    if (!/^[A-Z]$/.test(section)) {
      Alert.alert('Invalid input', 'Section must be a single letter (e.g. A).');
      return;
    }

    if (typeof onAddClass === 'function') {
      onAddClass({ year, section, studentCount });
    } else {
      Alert.alert('Add class', `${year}${section} (demo)`);
    }
    setYearInput('');
    setSectionInput('');
    setStudentCountInput('0');
    setAddModalVisible(false);
  };

  const withAdd = [...classesList, { id: 'add', title: 'Add', students: 0 }];

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < withAdd.length; i += 2) {
      const left = withAdd[i];
      const right = withAdd[i + 1];
      rows.push(
        <View style={styles.gridRow} key={`row-${i}`}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleCardPress(left)}
            style={[
              left.id === 'add' ? styles.addCard : styles.classGridCard,
              selected === left.id ? styles.classGridCardSelected : null,
            ]}
          >
            {left.id === 'add' ? (
              <Text style={styles.addPlus}>+</Text>
            ) : (
              <>
                <Text style={[styles.gridTitle, selected === left.id ? styles.gridTitleSelected : null]}>
                  {left.title}
                </Text>
                <Text style={[styles.gridSub, selected === left.id ? styles.gridSubSelected : null]}>
                  {left.students} students
                </Text>
              </>
            )}
          </TouchableOpacity>

          {right ? (
            right.id === 'add' ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(right)}
                style={[styles.addCard, { marginLeft: 8 }]}
              >
                <Text style={styles.addPlus}>+</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(right)}
                style={[
                  styles.classGridCard,
                  selected === right.id ? styles.classGridCardSelected : null,
                  { marginLeft: 8 },
                ]}
              >
                <Text style={[styles.gridTitle, selected === right.id ? styles.gridTitleSelected : null]}>
                  {right.title}
                </Text>
                <Text style={[styles.gridSub, selected === right.id ? styles.gridSubSelected : null]}>
                  {right.students} students
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Data</Text>
        <Text style={styles.headerIcon}>👤</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Classes</Text>
        {renderGrid()}
      </ScrollView>

      <View style={styles.updateWrapper} pointerEvents="box-none">
        <TouchableOpacity style={styles.updateBtn} activeOpacity={0.9} onPress={() => {
          if (!selected) { Alert.alert('No class selected', 'Please select a class first.'); return; }
          navigate('class', { classId: selected, classTitle: selected });
        }}>
          <Text style={styles.updateText}>Update Attendance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" active onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>

      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 12 }}>Add Class</Text>

            <Text style={{ alignSelf: 'flex-start', marginBottom: 6 }}>Year (e.g. 3)</Text>
            <TextInput
              value={yearInput}
              onChangeText={setYearInput}
              keyboardType="number-pad"
              placeholder="Enter year"
              style={{ width: '100%', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 12 }}
            />

            <Text style={{ alignSelf: 'flex-start', marginBottom: 6 }}>Section (letter e.g. A)</Text>
            <TextInput
              value={sectionInput}
              onChangeText={(t) => setSectionInput(t.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 1))}
              placeholder="Enter section (A)"
              style={{ width: '100%', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 12 }}
            />

            <Text style={{ alignSelf: 'flex-start', marginBottom: 6 }}>Initial student count (optional)</Text>
            <TextInput
              value={studentCountInput}
              onChangeText={(t) => setStudentCountInput(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder="0"
              style={{ width: '100%', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 16 }}
            />

            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Pressable onPress={() => setAddModalVisible(false)} style={[styles.modalActionAlt, { flex: 1, marginRight: 8 }]}>
                <Text style={{ fontWeight: '700' }}>Cancel</Text>
              </Pressable>

              <Pressable onPress={handleSubmitAdd} style={[styles.modalAction, { flex: 1, marginLeft: 8 }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function QueriesScreenTeacher({ onBack, navigate, queries = [], onResolveQuery }) {
  const grouped = queries.reduce((acc, q) => {
    acc[q.label] = acc[q.label] || [];
    acc[q.label].push(q);
    return acc;
  }, {});

  const handleResolve = (q, present) => {
    onResolveQuery && onResolveQuery(q.classId, q.dateKey, q.studentId, present);
    Alert.alert('Resolved', `${q.studentName} marked ${present ? 'Present' : 'Absent'} for ${q.label}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Queries</Text>
        <Text style={styles.headerIcon}>⋮</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {Object.keys(grouped).map((label) => (
          <View key={label} style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>{label}</Text>
            {grouped[label].map((q) => (
              <View key={q.id} style={styles.queryCard}>
                <View style={styles.queryHead}>
                  <View style={styles.avatarSmall}>
                    <Text style={{ fontWeight: '700' }}>{q.studentName.split(' ').map(n => n[0]).slice(0,2).join('')}</Text>
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>{q.studentName}</Text>
                    <Text style={{ color: '#7A7A7A', marginTop: 4 }}>{`Class ${q.classId}`}</Text>
                  </View>
                </View>

                <Text style={{ marginTop: 12, color: '#2F2F2F' }}>{q.message}</Text>

                <View style={{ flexDirection: 'row', marginTop: 14 }}>
                  <TouchableOpacity style={styles.queryBtnAlt} onPress={() => handleResolve(q, false)}>
                    <Text style={{ fontWeight: '700' }}>Absent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.queryBtn} onPress={() => handleResolve(q, true)}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Present</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" active onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

function ProfileScreenTeacher({ onBack, navigate, onLogout, profile = {}, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  useEffect(() => {
    setForm({ ...profile });
  }, [profile]);

  const onEdit = () => setEditing(true);
  const onCancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  const onSave = () => {
    if (!form.name || !form.name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    if (!form.employeeId || !form.employeeId.trim()) {
      Alert.alert('Validation', 'Employee ID cannot be empty.');
      return;
    }
    if (typeof onUpdateProfile === 'function') onUpdateProfile({ ...form });
    setEditing(false);
    Alert.alert('Saved', 'Profile updated.');
  };

  const onCall = () => {
    Alert.alert('Call', `Calling ${form.phone || profile.phone} (simulated)`);
  };

  const onEmail = () => {
    Alert.alert('Email', `Compose email to ${form.email || profile.email} (simulated)`);
  };

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ width: 24 }}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!editing ? (
            <TouchableOpacity onPress={onEdit} style={{ paddingHorizontal: 6 }}>
              <Text style={styles.headerIcon}>✎</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatarBig}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>
              {(form.name || '').split(' ').map(n => n[0]).slice(0,2).join('')}
            </Text>
          </View>

          <View style={{ marginTop: 12, alignItems: 'center', width: '100%' }}>
            {!editing ? (
              <>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileSubject}>{profile.subject}</Text>
              </>
            ) : (
              <>
                <TextInput
                  value={form.name}
                  onChangeText={(t) => handleChange('name', t)}
                  placeholder="Full name"
                  style={{ width: '100%', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }}
                />
                <TextInput
                  value={form.subject}
                  onChangeText={(t) => handleChange('subject', t)}
                  placeholder="Subject"
                  style={{ width: '100%', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8 }}
                />
              </>
            )}
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.actionBtn} onPress={onCall}><Text style={{ fontWeight: '700' }}>Call</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { marginLeft: 12 }]} onPress={onEmail}><Text style={{ fontWeight: '700' }}>Email</Text></TouchableOpacity>
          </View>

          {editing ? (
            <View style={{ width: '100%', marginTop: 16 }}>
              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Email</Text>
              <TextInput value={form.email} onChangeText={(t) => handleChange('email', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }} />

              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Phone</Text>
              <TextInput value={form.phone} onChangeText={(t) => handleChange('phone', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }} />

              <Text style={{ fontWeight: '700', marginBottom: 6 }}>School</Text>
              <TextInput value={form.school} onChangeText={(t) => handleChange('school', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }} />

              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Employee ID</Text>
              <TextInput value={form.employeeId} onChangeText={(t) => handleChange('employeeId', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }} />

              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Joined</Text>
              <TextInput value={form.joinDate} onChangeText={(t) => handleChange('joinDate', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 8 }} />

              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Office</Text>
              <TextInput value={form.officeRoom} onChangeText={(t) => handleChange('officeRoom', t)} style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 12 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <Pressable onPress={onCancel} style={[styles.modalActionAlt, { paddingVertical: 10, paddingHorizontal: 16 }]}>
                  <Text style={{ fontWeight: '700' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={onSave} style={[styles.modalAction, { paddingVertical: 10, paddingHorizontal: 16 }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={{ width: '100%', marginTop: 16 }}>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>School</Text><Text style={styles.infoValue}>{profile.school}</Text></View>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>Employee ID</Text><Text style={styles.infoValue}>{profile.employeeId}</Text></View>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>Joined</Text><Text style={styles.infoValue}>{profile.joinDate}</Text></View>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>Office</Text><Text style={styles.infoValue}>{profile.officeRoom}</Text></View>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{profile.email}</Text></View>
                <View style={styles.infoCard}><Text style={styles.infoLabel}>Phone</Text><Text style={styles.infoValue}>{profile.phone}</Text></View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Pressable style={[styles.startSessionBtn, { backgroundColor: '#E14E4E' }]} onPress={() => {
                  Alert.alert('Logout', 'Are you sure you want to logout?', [
                    { text: 'Cancel' },
                    { text: 'Logout', style: 'destructive', onPress: () => onLogout && onLogout() },
                  ]);
                }}>
                  <Text style={[styles.startSessionText, { color: '#fff' }]}>Logout</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

      </ScrollView>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" active onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

function TeacherApp({ onLogout }) {
  const [screen, setScreen] = useState('home');
  const [selectedMode, setSelectedMode] = useState('offline');
  const [navigateParams, setNavigateParams] = useState({});

  const [classesList, setClassesList] = useState(() =>
    Object.keys(baseStudents).map((k) => ({ id: k, title: k, students: baseStudents[k].length }))
  );

  const [roster, setRoster] = useState(() => {
    const initial = {};
    const sampleKey = toDateKey(new Date());
    Object.keys(baseStudents).forEach((c) => {
      initial[c] = {};
      initial[c][sampleKey] = (baseStudents[c] || []).map((s) => ({ ...s }));
    });
    return initial;
  });

  const [queries, setQueries] = useState(() => {
    const todayKey = toDateKey(new Date());
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    const yKey = toDateKey(yd);
    return [
      { id: 'q1', studentId: 's2', studentName: 'Bob Smith', classId: '3A', dateKey: todayKey, message: 'I was present but marked absent.', label: 'Today' },
      { id: 'q2', studentId: 's4', studentName: 'Diana Prince', classId: '3B', dateKey: yKey, message: 'Please check my attendance.', label: 'Yesterday' },
    ];
  });

  const [profile, setProfile] = useState(() => ({ ...teacherProfile }));

  const navigate = (to, params = {}) => {
    setNavigateParams(params || {});
    setScreen(to);
  };

  const handleClassPress = (classItem) => {
    const subject = classItem.title;
    if (selectedMode === 'offline') navigate('offline', { preselectedSubject: subject });
    else navigate('online', { preselectedSubject: subject });
  };

  const handleSaveAttendance = (classId, dateKey, updatedStudents) => {
    setRoster((prev) => {
      const copy = { ...prev };
      if (!copy[classId]) copy[classId] = {};
      copy[classId][dateKey] = updatedStudents.map((s) => ({ ...s }));
      return copy;
    });
  };

  const handleResolveQuery = (classId, dateKey, studentId, present) => {
    setRoster((prev) => {
      const copy = { ...prev };
      if (!copy[classId]) copy[classId] = {};
      if (!copy[classId][dateKey]) copy[classId][dateKey] = (baseStudents[classId] || []).map((s) => ({ ...s }));
      copy[classId][dateKey] = copy[classId][dateKey].map((s) => (s.id === studentId ? { ...s, present: !!present } : s));
      return copy;
    });
    setQueries((prev) => prev.filter((q) => !(q.classId === classId && q.studentId === studentId && q.dateKey === dateKey)));
  };

  const handleAddClass = ({ year, section, studentCount = 0 }) => {
    const yearStr = String(year).trim();
    const sectionStr = String(section).trim().toUpperCase();
    if (!/^\d+$/.test(yearStr)) {
      Alert.alert('Invalid year', 'Year must be a number (e.g. 3).');
      return;
    }
    if (!/^[A-Z]$/.test(sectionStr)) {
      Alert.alert('Invalid section', 'Section must be a single letter (e.g. A).');
      return;
    }
    const id = `${yearStr}${sectionStr}`;
    if (classesList.some((c) => c.id === id)) {
      Alert.alert('Already exists', `Class ${id} already exists.`);
      return;
    }
    setClassesList((prev) => [...prev, { id, title: id, students: Number(studentCount) || 0 }]);
    setRoster((prev) => {
      const copy = { ...prev };
      if (!copy[id]) copy[id] = {};
      const todayKey = toDateKey(new Date());
      if (!copy[id][todayKey]) copy[id][todayKey] = [];
      return copy;
    });
    setScreen('students');
    Alert.alert('Class added', `Created class ${id}`);
  };

  const handleLogin = (info) => {
    setScreen('home');
  };

  const handleLogoutLocal = () => {
    setScreen('login');
    onLogout && onLogout();
  };

  if (screen === 'offline') {
    return (
      <OfflineAttendanceTeacher
        onBack={() => navigate('home')}
        preselectedSubject={navigateParams.preselectedSubject}
        onStartSession={(durationSeconds, params) => navigate('session', { durationSeconds, ...(params || {}) })}
        navigate={navigate}
      />
    );
  }

  if (screen === 'online') {
    return (
      <OnlineAttendanceTeacher
        onBack={() => navigate('home')}
        preselectedSubject={navigateParams.preselectedSubject}
        onStartSession={(durationSeconds, params) => navigate('session', { durationSeconds, ...(params || {}) })}
        navigate={navigate}
      />
    );
  }

  if (screen === 'session') {
    return (
      <SessionScreenTeacher
        onEnd={() => navigate('home')}
        durationSeconds={navigateParams.durationSeconds || 60}
        subject={navigateParams.subject}
        mode={navigateParams.mode || 'online'}
        navigate={navigate}
      />
    );
  }

  if (screen === 'students') {
    return <StudentsScreenTeacher onBack={() => navigate('home')} navigate={navigate} classesList={classesList} onAddClass={handleAddClass} onSelectClass={() => {}} />;
  }

  if (screen === 'class') {
    const classIdRaw = navigateParams.classId || '';
    const classId = classIdRaw;
    const classTitle = navigateParams.classTitle || `${classId}`;
    const dateKey = navigateParams.dateKey || toDateKey(new Date());
    const studentsForDate =
      (classId && roster[classId] && roster[classId][dateKey]) ||
      (classId && baseStudents[classId] ? baseStudents[classId].map((s) => ({ ...s })) : []);
    return (
      <ClassAttendanceScreen
        classId={classId}
        classTitle={classTitle}
        students={studentsForDate}
        onBack={() => navigate('students')}
        onSave={handleSaveAttendance}
        navigate={navigate}
        initialDateKey={dateKey}
      />
    );
  }

  if (screen === 'queries') {
    return <QueriesScreenTeacher onBack={() => navigate('home')} navigate={navigate} queries={queries} onResolveQuery={handleResolveQuery} />;
  }

  if (screen === 'profile') {
    return (
      <ProfileScreenTeacher
        onBack={() => navigate('home')}
        navigate={navigate}
        onLogout={handleLogoutLocal}
        profile={profile}
        onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerIcon}>⚙</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.takeBtn, pressed && { opacity: 0.85 }]}
          onPress={() => {
            if (selectedMode === 'offline') navigate('offline');
            else navigate('online');
          }}
        >
          <Text style={styles.takeIcon}>☑</Text>
          <Text style={styles.takeText}>Take Attendance</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Attendance Mode</Text>

        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setSelectedMode('online')}
            style={({ pressed }) => [
              styles.modeBtn,
              styles.modeBtnLeft,
              selectedMode === 'online' ? styles.modeBtnSelected : null,
              pressed ? styles.modePressed : null,
            ]}
          >
            <Text style={[styles.modeText, selectedMode === 'online' ? styles.modeTextSelected : null]}>Online</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedMode('offline')}
            style={({ pressed }) => [
              styles.modeBtn,
              styles.modeBtnRight,
              selectedMode === 'offline' ? styles.modeBtnSelectedOutline : null,
              pressed ? styles.modePressed : null,
            ]}
          >
            <Text style={[styles.modeText, selectedMode === 'offline' ? styles.modeTextSelectedOutline : null]}>Offline</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Classes</Text>

        <FlatList
          data={classesList}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleClassPress(item)}>
              <View style={styles.classCard}>
                <View style={styles.classIconWrap}>
                  <Text style={styles.classIcon}>📚</Text>
                </View>

                <View style={styles.classContent}>
                  <Text style={styles.classTitle}>{item.title}</Text>
                  <Text style={styles.classTime}>{item.students} students</Text>
                </View>

                <View style={styles.chevronWrap}>
                  <Text style={styles.chevron}>{'>'}</Text>
                </View>
              </View>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 140 }}
        />
      </ScrollView>

      <View style={styles.bottomBar} pointerEvents="box-none">
        <TeacherTab label="Attendance" active onPress={() => navigate('home')} />
        <TeacherTab label="Students" onPress={() => navigate('students')} />
        <TeacherTab label="Queries" onPress={() => navigate('queries')} />
        <TeacherTab label="Profile" onPress={() => navigate('profile')} />
      </View>
    </SafeAreaView>
  );
}

/* ---------- Login (combined) ---------- */
function CombinedLogin({ onLogin }) {
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!userId.trim() || !password) {
      Alert.alert('Validation', 'Please enter both ID and password.');
      return;
    }

    if (role === 'teacher') {
      if (userId.trim() !== teacherProfile.employeeId || password !== 'password') {
        Alert.alert('Invalid', 'Use demo teacher credentials.');
        return;
      }
      // teacher login
      onLogin && onLogin({ role, userId });
      return;
    }

    // STUDENT login -> automatically open camera then call onLogin
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      saveToPhotos: false,
      quality: 0.7,
    };

    try {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          // user cancelled — we still proceed to login (you said camera should open automatically)
          Alert.alert('Info', 'Camera cancelled. Logging in anyway.');
          onLogin && onLogin({ role, userId, photoUri: null });
          return;
        }
        if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage || 'Unknown error');
          onLogin && onLogin({ role, userId, photoUri: null });
          return;
        }
        const asset = response?.assets && response.assets.length ? response.assets[0] : null;
        const photoUri = asset?.uri || null;
        onLogin && onLogin({ role, userId, photoUri });
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not open camera. Logging in anyway.');
      onLogin && onLogin({ role, userId, photoUri: null });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { justifyContent: 'center' }]}>
      <View style={{ padding: 24 }}>
        <Text style={[styles.h1, { textAlign: 'center', marginBottom: 16 }]}>Welcome — Please Login</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 18 }}>
          <TouchableOpacity onPress={() => setRole('student')} style={{ padding: 10, marginRight: 8, backgroundColor: role === 'student' ? '#0A84FF' : '#F2F2F2', borderRadius: 8 }}>
            <Text style={{ color: role === 'student' ? '#fff' : '#111', fontWeight: '700' }}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole('teacher')} style={{ padding: 10, backgroundColor: role === 'teacher' ? '#0A84FF' : '#F2F2F2', borderRadius: 8 }}>
            <Text style={{ color: role === 'teacher' ? '#fff' : '#111', fontWeight: '700' }}>Teacher</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ marginBottom: 6 }}>User ID</Text>
        <TextInput
          value={userId}
          onChangeText={setUserId}
          placeholder="Enter your ID"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        <Text style={{ marginBottom: 6 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />

        {/* removed manual 'Launch Camera' button as requested — camera will auto-open for students on login */}

        <TouchableOpacity onPress={handleLogin} style={[styles.raiseButton, { alignItems: 'center' }]}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Login as {role === 'student' ? 'Student' : 'Teacher'}</Text>
        </TouchableOpacity>

        <Text style={{ color: '#666', marginTop: 12, fontSize: 12 }}>
          (Teacher demo credential: Unique ID = {teacherProfile.employeeId} · Password = password)
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Top-level App ---------- */
export default function App() {
  const [loggedInRole, setLoggedInRole] = useState(null); // null | 'student' | 'teacher'
  const [sessionInfo, setSessionInfo] = useState(null);

  const handleLogin = ({ role, userId, photoUri }) => {
    setLoggedInRole(role);
    setSessionInfo({ userId, role, photoUri });
  };

  const handleLogout = () => {
    setLoggedInRole(null);
    setSessionInfo(null);
  };

  return (
    <NavigationContainer>
      {!loggedInRole ? (
        <CombinedLogin onLogin={handleLogin} />
      ) : loggedInRole === 'student' ? (
        <StudentMainTabs onLogout={handleLogout} />
      ) : (
        <TeacherApp onLogout={handleLogout} />
      )}
    </NavigationContainer>
  );
}

/* ---------- Styles (unchanged) ---------- */
const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#f6f7fb', paddingTop: Platform.OS==='android' ? StatusBar.currentHeight : 0 },
  center: { flex:1, alignItems:'center', justifyContent:'center' },

  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  brand: { fontWeight:'700', fontSize:18 },

  avatar: { width:100, height:100, borderRadius:50, marginTop:12 },
  name: { fontSize:18, fontWeight:'700', marginTop:8 },
  sub: { color:'#888', marginTop:4 },

  attCard: { marginTop:16, alignItems:'center', backgroundColor:'#fff', borderRadius:12, padding:12, borderWidth:1, borderColor:'#eee' },
  attLabel: { color:'#666' },
  ringWrap: { width:90, height:90, marginTop:8, alignItems:'center', justifyContent:'center' },
  ringGrey: { position:'absolute', width:90, height:90, borderRadius:45, borderWidth:8, borderColor:'#eee' },
  ringColored: { position:'absolute', width:90, height:90, borderRadius:45, borderWidth:8, borderColor:'#ff6b6b', borderLeftColor:'transparent', borderBottomColor:'transparent' },
  centerCircle: { width:60, height:60, borderRadius:30, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  percentText: { fontWeight:'700', fontSize:16 },

  warnCard: { marginTop:14, backgroundColor:'#ffeaea', borderLeftWidth:4, borderLeftColor:'#f28b8b', padding:12, borderRadius:8 },
  warnTitle: { color:'#9b1d1d', fontWeight:'700', marginBottom:6 },
  warnText: { color:'#7a1b1b' },

  card: { backgroundColor:'#fff', borderRadius:12, padding:16, marginTop:16, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:5, elevation:2 },
  cardTitle: { fontWeight:'700', marginBottom:6, fontSize:16 },
  percentBig: { fontSize:22, fontWeight:'700', marginBottom:4 },
  subText: { fontSize:13, color:'#888' },

  h1: { fontSize:18, fontWeight:'700' },
  sectionTitle: { fontWeight:'700', marginBottom:8, marginTop:12 },

  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  tableHeader: { backgroundColor: '#2f7a93', paddingVertical: 12, borderRadius: 6, marginBottom: 8 },
  headerText: { color: '#fff', fontWeight: '700', paddingHorizontal:4, fontSize: 13 },

  colSr: { width: 40, alignItems: 'center', justifyContent: 'center' },
  colDate: { width: 86, alignItems: 'center', justifyContent: 'center' },
  colPeriod: { width: 60, alignItems: 'center', justifyContent: 'center' },
  colSubject: { flex: 1, paddingHorizontal: 8 },
  colStatus: { width: 90, alignItems: 'center', justifyContent: 'center' },

  cellText: { color: '#444' },

  datePill: { backgroundColor: '#ffd8dd', paddingVertical: 6, paddingHorizontal: 6, borderRadius: 4 },
  dateText: { textAlign: 'center', color: '#333', lineHeight: 18 },

  rowEven: { backgroundColor: '#ffffff' },
  rowOdd: { backgroundColor: '#fafbfd' },

  presentBackground: { borderColor:'#e6f7ec', backgroundColor:'#fff' },
  absentBackground: { borderColor:'#fbeaea', backgroundColor:'#fff8f8' },

  subjectText: { fontWeight:'700' },
  statusText: { fontSize:13 },
  raiseButton: { backgroundColor:'#0A84FF', paddingHorizontal:14, paddingVertical:8, borderRadius:8 },

  dropdown: { borderWidth:1, borderColor:'#111', borderRadius:8, paddingHorizontal:12, paddingVertical:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },

  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', padding:24 },
  modalContent: { backgroundColor:'#fff', borderRadius:8, padding:12 },
  modalItem: { paddingVertical:12, paddingHorizontal:8, borderBottomWidth: 0.5, borderBottomColor:'#eee' },

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerIcon: { fontSize: 18 },
  headerLeft: { width: 24 },
  backIcon: { fontSize: 18 },

  content: { paddingHorizontal: 16 },

  takeBtn: {
    backgroundColor: '#1976F3',
    height: 56,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  takeIcon: { color: '#fff', marginRight: 10, fontSize: 18 },
  takeText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  modeRow: { flexDirection: 'row', marginTop: 12 },
  modeBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  modeBtnLeft: { marginRight: 8 },
  modeBtnRight: { marginLeft: 8 },
  modeBtnSelected: { backgroundColor: '#E8F1FF', borderWidth: 2, borderColor: '#1976F3' },
  modeBtnSelectedOutline: { backgroundColor: '#F4F8FF', borderWidth: 2, borderColor: '#1976F3' },
  modePressed: { opacity: 0.85 },

  modeText: { fontSize: 16, color: '#222', fontWeight: '600' },
  modeTextSelected: { color: '#1976F3' },
  modeTextSelectedOutline: { color: '#1976F3' },

  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  classIconWrap: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  classIcon: { fontSize: 22 },
  classContent: { flex: 1 },
  classTitle: { fontSize: 16, fontWeight: '700' },
  classTime: { fontSize: 13, color: '#7A7A7A', marginTop: 6 },
  chevronWrap: { width: 24, alignItems: 'flex-end' },
  chevron: { color: '#BDC3C7', fontSize: 18 },

  selectRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  selectText: { fontSize: 16, color: '#222' },
  selectChevron: { color: '#7A7A7A' },

  uploadBox: { borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', padding: 20, marginTop: 20 },
  uploadBtn: { backgroundColor: '#1976F3', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 14 },
  uploadBtnText: { color: '#fff', fontWeight: '700' },

  startSessionBtn: { backgroundColor: '#1976F3', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  startSessionText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  timerBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bigCircle: { width: 260, height: 260, borderRadius: 130, backgroundColor: '#EEF6FF', alignItems: 'center', justifyContent: 'center' },
  smallCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#1976F3', alignItems: 'center', justifyContent: 'center' },
  stopBtn: { backgroundColor: '#E14E4E', paddingHorizontal: 26, paddingVertical: 14, borderRadius: 10 },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  tab: { alignItems: 'center' },
  tabText: { fontSize: 12, color: '#7A7A7A' },
  tabActiveText: { color: '#1976F3', fontWeight: '700' },

  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  classGridCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  classGridCardSelected: {
    backgroundColor: '#2F72E6',
  },
  gridTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  gridTitleSelected: { color: '#fff' },
  gridSub: { fontSize: 14, color: '#7A7A7A', marginTop: 6 },
  gridSubSelected: { color: 'rgba(255,255,255,0.9)' },

  addCard: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  addPlus: { fontSize: 28, color: '#7A7A7A' },

  updateWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    alignItems: 'center',
  },
  updateBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2F72E6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  updateText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  presentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#E9EEF7',
  },
  presentBtnActive: {
    backgroundColor: '#3BC06B',
  },
  presentBtnInactive: {
    backgroundColor: '#E9EEF7',
  },
  presentText: { color: '#7A7A7A', fontWeight: '700' },
  presentTextActive: { color: '#fff' },

  absentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
  },
  absentBtnActive: {
    backgroundColor: '#E14E4E',
  },
  absentBtnInactive: {
    backgroundColor: '#F0F0F0',
  },
  absentText: { color: '#7A7A7A', fontWeight: '700' },
  absentTextActive: { color: '#fff' },

  modalCard: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalBtn: {
    backgroundColor: '#F3F3F3',
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAction: {
    backgroundColor: '#2F72E6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalActionAlt: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  queryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  queryHead: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryBtn: {
    marginLeft: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2F72E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryBtnAlt: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarBig: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2F72E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileSubject: {
    color: '#7A7A7A',
    marginTop: 6,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionBtn: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: { color: '#7A7A7A', fontWeight: '700', marginBottom: 6 },
  infoValue: { fontSize: 16 },
});
