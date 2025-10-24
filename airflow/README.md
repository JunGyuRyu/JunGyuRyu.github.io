# Airflow

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled.png)

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%201.png)

<aside>
💡 ETL: Extract, Transform and Load

- Extract : 소스를 사용해서 데이터 덤프로부터 데이터를 받아오는 작업들
- Transform : 데이터의 형태 및 포맷을 바꾸는 것, 경우에 따라서 이 과정 생략 가능
- Load: 데이터 웨어하우스에서 테이블 형태로 적재 혹은 레이크에 적재
</aside>

<aside>
💡 ETL vs ELT

- ETL: 데이터를 데이터 웨어하우스 외부에서 내부로 가져오는 프로세스
- ELT: 데이터 웨어하우스 내부 데이터를 조작해서 (보통은 좀더 추상화
되고 요약된) 새로운 데이터를 만드는 프로세스
▪ 이 경우 데이터 레이크(DW보다 Scalable)를 쓰기도 함
</aside>

![출처: [https://stanford-cs329s.github.io/slides/cs329s_12_stefan_model_deploymet_stitch_fix.pdf](https://stanford-cs329s.github.io/slides/cs329s_12_stefan_model_deploymet_stitch_fix.pdf)](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%202.png)

출처: [https://stanford-cs329s.github.io/slides/cs329s_12_stefan_model_deploymet_stitch_fix.pdf](https://stanford-cs329s.github.io/slides/cs329s_12_stefan_model_deploymet_stitch_fix.pdf)

# 0. 신뢰할 수 있는 데이터 파이프라인 만들기

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%203.png)

1. 데이터가 작을 경우 매번 통째로 복사해서 테이블 만들기(Full Refresh)
◦ Full Refresh : 매번 쓸 수 있는 데이터를 가져다가 통째로 복사해서 업데이트
◦ Incremental update : 매시간 매일 바뀐 것만 가져다 DW에 업데이트 하는 것
    1. Incremental Update를 하려면 특정 날짜나 숫자로 된 id를 기준으로 새로 생성되거나 업데이트된 레코드들을 읽어올 수 있어야 합니다. (예시: timestamp, increment key)
    
2. 멱등성(Idempotency) 보장
    
    <aside>
    💡 멱등성
    - 동일한 입력 데이터로 데이터 파이프라인을 다수 실행할 때는 최종 테이블의 내용이 달라지지 말아야 한다는 원칙 (중복 데이터가 생기지 않게 만들기 등)
    - SQL의 transaction이 이를 위한 대표적 기술입니다.
    
    ![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%204.png)
    
    - 출처: [https://www.yes24.com/Product/Goods/107878326](https://www.yes24.com/Product/Goods/107878326)
    </aside>
    

1. 실패한 데이터 파이프라인 작업의 재실행이 쉬워야 함
    1.  재실행이 쉽지 않은 케이스 : Incremental update
    업데이트를 실패한 그 당시로 돌아가서 재실행을 해야 하는데, Incremental update는 그 실패 케이스가 full refresh보다 복잡함
    2. 어떤 날짜가 실패할 경우, 특정 날짜가 빌 수 있음
    ◦ 즉, 과거 데이터를 다시 채우는 과정(Backfill)이 필요함
    
2. 데이터 파이프라인의 입력과 출력을 명확히 문서화
    1. 비지니스 오너를 명시 : 누가 이 데이터를 요청했는지를 기록으로 남겨야 편해집니다.
    
    <aside>
    💡 데이터 리니지(데이터 계보)
    현재 쓰이는 데이터가 어떻게 생성됐고, 어떤 과정을 거쳤으며, 어디에 쓰이고 있는지 등의 계보를 관리해 현황을 파악하는 프로세스를 의미합니다. (데이터 사용에 대한로그 수집)
    
    </aside>
    
3. 주기적으로 쓸모없는 데이터들을 삭제하기
    1. 사용되지 않는 테이블과 데이터 파이프라인은 꼭 제거해주는 것이 필요합니다.
    2. DW에는 필요한 데이터만 유지하고 이전 데이터를 DL(또는 저장소)로 이동시킵니다.
    

# 1. Airflow의 개념

### **Batch Process**

- 프로그래밍에서는 컴퓨터 프로그램 흐름에 따라 일회성(1회), 또는 주기마다 예약된 시간에 실행되는 프로세스를 `Batch Process`라고 부릅니다. Airflow는 `Batch Process` 에 최적화된 프레임워크입니다.

## **Airflow 등장 전의** Batch Process 구축 방법 : Linux Crontab

**크론표현식**

![](https://blog.kakaocdn.net/dn/eg7uPf/btrnPlnHM91/SK2OgCd2SWzwKdapkGQ8G0/img.png)

**자주 사용되는 크론표현식**

![](https://blog.kakaocdn.net/dn/orXcR/btrnN1C1bXt/S2WkJs3GYKHEhnA4I7ZjWK/img.png)

- **크론 메이커 :** [http://www.cronmaker.com](http://www.cronmaker.com/)
- **크론 해석기 :** [https://crontab.guru/](https://crontab.guru/)

 **크론탭의 문제**

- 재실행 및 알람 부재
    - 파일을 실행하다 오류가 발생한 경우, 크론탭은 별도의 처리를 하지 않습니다
        - 실패할 경우, request나 인터넷 문제일 수 있으니 자동으로 몇 번 더 재실행(Retry)하고, 그래도 실패하면 실패했다는 알람을 받으면 좀더 유용하지 않을까요?
- 과거 실행 이력 및 실행 로그를 보기도 어렵습니다.
- 여러 파일을 실행하거나, 복잡한 파이프라인을 만들기가 어렵습니다.

→ Crontab은 간단한 작업에는 유용하나 실패 시 재실행, 실행 로그 확인, 알람 등의 기능이 필요했습니다.

<aside>
💡 **Airflow 등장 후**
파이썬을 사용해 스케줄링 및 파이프라인을 작성하면서 반복 작업에서 아래와 같은 기능이 가능해졌습니다.

- 실패 시 알람
- 실패 시 재실행 시도
- 동시 실행 워커 수 관리
- 설정 및 변수 값 분리

</aside>

## 가. Airflow란?

<aside>
💡 **Airflow**

Airflow는 Flask 기반으로 작성된 여러가지 태스크들(데이터셋 생성, 모델 학습 등)을 일련의 그래프로 연결하고 스케줄링, 모니터링 등 파이프라인 관리를 위한 다양한 기능을 제공하고 있는 Workflow Management Platform입니다. 

워크플로는 DAG(Directed Acyclic Graph)로 표시되며, 종속성과 데이터 흐름을 고려하여 정렬된 Task라는 개별 작업을 포함합니다.

</aside>

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%205.png)

![](https://static.us-east-1.prod.workshops.aws/public/e2623647-6e0e-4ffb-8962-40c3bc641731/static/images/mwaa/Airflow-01.png)

- DAG는 작업 간의 종속성과 Task를 실행하고 재시도를 실행하는 순서를 지정합니다. Airflow는 일반적으로 다음 구성 요소를 포함합니다.
    - Scheduler: 예약된 워크플로를 트리거하고 Task를 실행하도록 관리합니다.
    - Executor: 실행 중인 task를 처리합니다. 기본적으로 executor는 scheduler 내에 포함된 task를 관리하지만 운영 환경에 적합한 executor는 worker에 task를 푸시합니다.
    - Webserver: DAG 및 task의 동작을 검사, 트리거 및 디버그할 수 있는 사용자 인터페이스를 제공합니다.
    - Metadata Database: Scheduler, executor 및 webserver에서 상태를 저장하는 데 사용하는 메타데이터 데이터베이스입니다.

![](https://static.us-east-1.prod.workshops.aws/public/e2623647-6e0e-4ffb-8962-40c3bc641731/static/images/mwaa/Airflow-02.png)

- Workloads DAG는 일련의 task를 통해 실행되며 다음과 같은 세 가지 일반적인 task 유형이 있습니다.
    - Operators: 개념적으로 DAG 내에서 미리 정의된 task에 대한 템플릿
    - Sensors: 한 가지 task를 수행하도록 설계된 특수한 유형의 operator
    - TaskFlow: Python 코드를 사용하여 DAG를 작성하는 경우, TaskFlow API를 사용하면 추가 상용구 없이 DAG를 쉽게 작성 가능

## 나. Airflow의 구성요소

![](https://blog.kakaocdn.net/dn/nufwe/btrnVblFqr8/7VcAdZHcwHOCP5iP1Q67lK/img.png)

### 1) Airflow의 구성

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%206.png)

### airflow webserver

- airflow UI
- workflow 상태 표시하고 실행, 재시작, 수동 조작, 로그 확인

### airflow scheduler

- 작업 기준이 충족되는지 여부를 확인
- 종속 작업이 성공적으로 완료되었고, 예약 간격이 주어지면 실행할 수 있는 작업인지, 실행 조건이 충족되는지 등
- 위 충족 여부가 DB에 기록되면, task들이 worker에게 선택되서 작업을 실행함

### airflow celery worker

- 할당된 작업을 실행하는 일꾼
- 여러개의 worker로 작업
- default는 한 개의 worker로 로컬에서 작업이 돌아감
- celery를 따로 설치하지 않고, airflow 설치 후 `airflow celery worker -H worker_name -q queue_name`으로 실행
    
    <aside>
    💡 Celery Executor
    
    Celery Executor는 Task를 메시지 브로커에 전달하고, Celery Worker가 Task를 가져가서 실행하는 방식입니다. Worker 수를 스케일아웃 할 수 있다는 장점이 있지만, 메시지 브로커를 따로 관리해야하고 워커 프로세스에 대한 모니터링도 필요하다는 단점이 있습니다
    
    ![](https://velog.velcdn.com/images/bbkyoo/post/917c1f6f-d093-4220-80bd-ebc05ab0a8e8/image.gif)
    
    </aside>
    

### airflow celery flower

- celery UI
- worker 상태, queue 등 확인

### Database

- tasks, DAGs, 변수, connections 정보들 등의 상태에 대한 정보 등 메타데이터를 저장

### redis

- Key, Value 구조의 비정형 데이터를 저장하고 관리하기 위한 오픈 소스 기반의 비관계형 데이터 베이스 관리 시스템 (DBMS)
- 데이터베이스, 캐시, 메세지 브로커로 사용되며 인메모리 데이터 구조를 가진 저장소
- message broker를 redis로 사용
- 실행할 명령을 queue에 저장

### result backend

- 완료된 명령의 상태 저장

# 2. Airflow 설치 및 실행하기

## 가. Ubuntu 환경에서 Docker로 설치 및 실행

[Running Airflow in Docker — Airflow Documentation](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html)

```html
$ ubuntu
$ mkdir airflow
$ cd airflow
$ curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.6.3/docker-compose.yaml'
$ mkdir -p ./dags ./logs ./plugins ./config
$ echo AIRFLOW_UID=50000 > .env
$ docker compose up airflow-init
$ docker compose up
```

## 나. 수업에서 사용할 Airflow

[https://github.com/YeonjiKim0316/airflow_test](https://github.com/YeonjiKim0316/airflow_test)

# 3. Airflow **DAG 작성하기**

```html
$ cd {DAG를 작성할 폴더}
```

## 가. Airflow 코드의 기본 구조

1) DAG 대표하는 객체를 먼저 만들기

- DAG 이름, 실행주기, 실행날짜, 오너 등등

2) DAG를 구성하는 태스크 만들기

- 태스크별로 적합한 오퍼레이터를 선택
- 태스크 ID를 부여하고 해야할 작업의 세부사항 지정

3) 최종적으로 태스크들 간의 실행 순서를 결정

- 4) UI에서 실행과 확인
    - DAG 파일을 저장하면, Airflow 웹 UI에서 확인할 수 있습니다.
    - Airflow 웹 UI에서 해당 DAG을 ON으로 변경하면 DAG이 스케줄링되어 실행됩니다.
    - DAG 세부 페이지에서 실행된 DAG Run의 결과를 볼 수 있습니다.

```python
# 0_HelloWorld.py
from datetime import timedelta
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
import pendulum # python의 datetime을 좀더 편하게 사용할 수 있게 돕는 모델
from datetime import datetime

local_tz = pendulum.timezone("Asia/Seoul")

init_args = {
'start_date' : datetime(2022, 8, 22, 2, tzinfo=local_tz)
}

def print_world() -> None:
    print("world")

# 1) DAG 대표하는 객체를 먼저 만들기
with DAG(
    dag_id="hello_world", # DAG의 식별자용 아이디입니다.
    description="My First DAG", # DAG에 대해 설명합니다.
    start_date=days_ago(2), # DAG 정의 기준 2일 전부터 시작합니다.
	  # start_date=datetime(2023, 8, 7, hour=12, minute=30), # DAG 정의 기준 시간부터 시작합니다
    # start_date=airflow.utils.dates.days_ago(14),  
			# 스케쥴의 간격과 함께 DAG 첫 실행 시작 날짜를 지정해줍니다.
      # 주의: 1월 1일에 DAG를 작성하고 자정마다 실행하도록 schedule_interval을 지정한다면 태스크는 1월 2일 자정부터 수행됩니다	
    end_date=datetime(year=2023, month=8, day=19),
		# schedule_interval="0 6 * * *", # 매일 06:00에 실행합니다.
		schedule_interval="@daily", # DAG 실행 간격 - 매일 자정에 실행
    tags=["my_dags"],
    ) as dag:

# 2) DAG를 구성하는 태스크 만들기
# -1. bash 커맨드로 echo hello 를 실행합니다.
t1 = BashOperator(
    task_id="print_hello",
    bash_command="echo Hello",
    owner="fisa", # 이 작업의 오너입니다. 보통 작업을 담당하는 사람 이름을 넣습니다.
    retries=3, # 이 태스크가 실패한 경우, 3번 재시도 합니다.
    retry_delay=timedelta(minutes=1), # 재시도하는 시간 간격은 1분입니다.
)

# 2) DAG를 구성하는 태스크 만들기
# -2. python 함수인 print_world를 실행합니다.
t2 = PythonOperator(
    task_id="print_world",
    python_callable=print_world,
    depends_on_past=True,
    owner="fisa",
    retries=3,
    retry_delay=timedelta(minutes=5),
)

# 3) 최종적으로 태스크들 간의 실행 순서를 결정
# t1 실행 후 t2를 실행합니다.
t1 >> t2
```

```python
$ airflow dags list  # airflow는 dags 경로를 5분마다 스캔하여 업데이트합니다.
```

- Airflow는 DAG이라는 단위로 스케줄링을 관리합니다.
- 각 DAG은 Task로 구성되며,
- DAG 내 Task는 순차적으로 실행되거나, 동시에(병렬로) 실행할 수 있습니다.

- 크론식을 사용하면 특정 날짜로는 스케쥴을 정의할 수 있지만, 특정 빈도로는 스케쥴을 정의하기 어렵습니다. (3일마다, 2일마다 등등) 그래서 airflow는 스케쥴 간격에 대한 프리셋을 제공합니다.

```html
@once # 1회만 실행하도록 스케쥴
@hourly # 매시간 변경시 1회 실행
@daily # 매일 자정에 1회 실행
@weekly # 매주 일요일 자정에 1회 실행
@monthly # 매월 1일 자정에 1회 실행
@yearly # 매월 1월 1일 자정(1월 1일이 시작하는 시간)에 1회 실행
```

- 이제 Airflow 서버에 로그인하고 다음 명령을 실행해보세요
    
    ```python
    $ docker ps
    $ docker exec -it 컨테이너이름 /bin/bash
    $ airflow dags list
    $ airflow tasks list {dag이름}
    $ airflow tasks test {DAG이름} {Task이름} {날짜 YYYY-MM-DD}
    
    ```
    

## 태스크와 오퍼레이터의 차이

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%207.png)

- 사용자가 정의한 하나의 DAG에 담긴 각 오퍼레이터는 단일 작업을 수행합니다.
- 태스크는 개발자와 에어플로우 사이에서 작업의 올바른 실행을 보장하기 위한 오퍼레이터의 매니저 역할을 하는 Airflow 컴포넌트입니다.

## Jinja Template

- DAG의 모든 task에서 공통 변수를 사용하거나 가변하는 데이터를 활용하는 경우가 많습니다. 이 때는 Flask 기반으로 이루어진 프레임워크이므로 진자 템플릿을 활용할 수 있습니다.

먼저 user_defined_macros라는 속성에 변수를 등록하면 그 당시에 활용하는 DAG안에 공통 변수를 설정 할 수 있습니다. 아래 코드는 완성 코드 입니다. MACROS_VAR에 공통 변수로 활용할 값을 설정하고, DAG안에 user_defined_macros라는 속성에 넣었습니다.

[Templates reference — Airflow Documentation](https://airflow.apache.org/docs/apache-airflow/stable/templates-ref.html)

```python
# 6_Jinja_v2.py {{ }}
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    'owner': 'fisa',
}

# 매크로로 사용할 변수 설정
MACRO_VARS={
    "id" : "fisa_test",
    "pw" : 1234,
    "dataset" : "AI_Engineering"
}

with DAG(
    dag_id="ex_user_defined_macros",
    default_args=default_args,
    start_date=datetime(2022, 4, 30),
    schedule_interval='@once',
    # MACRO_VARS 변수 설정
    # DAG객체 안에 user_defined_macros를 설정하면 Task에서 JinjaTemplate으로 불러 사용가능하다.
    user_defined_macros=MACRO_VARS,
    tags=['test', 'user_defined_macros sample'],
) as dag:
    
    task1 = BashOperator(
        task_id='task1', 
        # jinja template을 이용하여 변수 활용
        bash_command="echo '{{id}} and {{pw}} and {{dataset}}'"
    )

    task1
```

# **유용한 Operator 간단 소개**

- MySQLOperator
    - DB에 저장된 테이블을 불러오기 위해 MySqlOperator를 사용하기 위해서는 먼저 UI 내에서 Mysql을 연결합니다.
    - Airflow UI -> `Admin` -> `Connection` -> `+`버튼을 누르면 아래와 같은 화면이 나오는데 DB 연결 정보를 입력하고 Test를 눌러 연결이 잘 되는지 확인합니다.
    
    ![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%208.png)
    
    여기서 입력했던  `Connection ID`를 MySqlOperator 내에 작성합니다.
    
    ```python
    db_data = MySqlOperator(
          task_id = 'import_table',
          mysql_conn_id = 'connect_mysql',  # Connection ID
          sql = ['SELECT * FROM DBNAME.DBTABLE;'],
          dag = init_dag
    )
    ```
    
    - 이미 테이블은 MySQL쪽에 만들어져 있고 레코드들이 존재하며 이 중 특정 조건에 맞는 글만을 추려 S3 서버에 복사해보겠습니다.
    - MySQL에 Query를 날리기 위해서는 `MySqlOperator` 모듈이 필요합니다.
        
        ```python
        $ docker exec -it 컨테이너이름 /bin/bash
        $ pip3 install apache-airflow-providers-mysql
        ```
        
- SqlToS3Operator
    
    외부 Third Party와 연동해 사용하는 Operator의 경우 (docker, aws, gcp 등)
    
    혹시 실행이 되지 않으면 Airflow 설치 시에 다음처럼 extra package를 설치해야 합니다.
    
    [SQL to Amazon S3 — apache-airflow-providers-amazon Documentation](https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/transfer/sql_to_s3.html)
    
    ```python
    $ docker exec -it {airflow_test-airflow-webserver의 컨테이너이름} /bin/bash
    $ pip install 'apache-airflow[amazon]'
    ```
    
    ### 실습: MySQL SQL select 결과를 S3 버킷에 파일로 업로드하기
    
    ```python
    # 3_MySQLtoS3.py
    
    # aws 테이블 확인
    from datetime import datetime, timedelta
    from email.policy import default
    from textwrap import dedent
    from datetime import datetime, timedelta
    
    from airflow import DAG
    from airflow.operators.python import PythonOperator
    # from airflow.providers.amazon.aws.hooks.s3 import S3Hook
    from airflow.providers.mysql.operators.mysql import MySqlOperator
    from airflow.exceptions import AirflowException
    from airflow.providers.amazon.aws.transfers.sql_to_s3 import SqlToS3Operator
    
    # Define the DAG
    dag = DAG(
        'mysql_to_s3_employee',
        default_args={
            'owner': 'woori-fisa',
            'start_date': datetime(2023, 8, 24),
            'retries': 1,
            'retry_delay': timedelta(minutes=5),
        },
        schedule_interval=timedelta(minutes=5),  # Run every 5 minutes
        catchup=False,  # Do not backfill if the DAG is paused and resumed
        tags=['MySQLtoS3'],
    )
    
    # Define the task
    mysql_to_s3_task = SqlToS3Operator(
        task_id='mysql_to_s3_employee_task',
        query='SELECT * FROM employees',
        sql_conn_id='AWS_RDB',  # Replace with your MySQL connection ID
        aws_conn_id='AWS_S3',        # Replace with your AWS connection ID
        s3_bucket='woori-fisa',           # Replace with your S3 bucket name
        s3_key='yeonji/employee_test.csv',
        replace=True,
        dag=dag,
    )
    
    # s3_bucket: 데이터가 저장될 장소
    # s3_key: 이름. 스키마의 table 명과 비슷한 개념
    # sql_conn_id, aws_conn_id: sql, aws(s3) connection.
    # replace: S3 내부에 파일이 있다면 대체할 지에 대한 설정. sql의 if exist와 비슷한 맥락
    # pd_kwargs: dataframe에 대한 설정값
    
    mysql_to_s3_task
    ```
    

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%209.png)

- S3Operator
    
    ![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%2010.png)
    
    [](https://velog.io/@jskim/Airflow-Pipeline-만들기-AWS-S3에-파일-업로드하기)
    

### **기본 아키텍처**

![](https://blog.kakaocdn.net/dn/nufwe/btrnVblFqr8/7VcAdZHcwHOCP5iP1Q67lK/img.png)

 **MLOps 관점의 Airflow**

“주기적인 실행”이 필요한 경우

- Batch Training : 1주일 단위로 모델 학습
- Batch Serving(Batch Inference) : 30분 단위로 인퍼런스
- 인퍼런스 결과를 기반으로 일자별, 주차별 모델 퍼포먼스 Report 생성
- MySQL에 저장된 메타데이터를 데이터 웨어하우스로 1시간 단위로 옮기기
- S3, GCS 등 Objest Storage
- Feature Store를 만들기 위해 Batch ETL 실행

**Airflow 추천글**

- 버킷플레이스 - Airflow 도입기 - [https://www.bucketplace.co.kr/post/2021-04-13-버킷플레이스-airflow-도입기/](https://www.bucketplace.co.kr/post/2021-04-13-%EB%B2%84%ED%82%B7%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4-airflow-%EB%8F%84%EC%9E%85%EA%B8%B0/)
- Airflow Executors Explained - [https://www.astronomer.io/guides/airflow-executors-explained](https://www.astronomer.io/guides/airflow-executors-explained)

[Astronomer Registry](https://registry.astronomer.io/)

# 참고: EC2에 airflow 설치 및 설정

```python
# git repository와 local repository 연결
git init
git remote -v
git remote remove origin
git remote -v
git remote add origin {본인의 repository}
git branch -M main
git add .
git commit -m "airflow study"
git push origin main
```

1. AIRFLOW는 최소 4gb 메모리와 10GB의 여유공간을 필요로 합니다. t2.large / 20GB로 EC2를 생성하고 docker를 설치해주세요.
2. 인바운드 규칙은 아래와 같습니다
    
    ![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%2011.png)
    

## 참고: EC2에 Docker 설치하기

현재 우리의 EC2 환경은 텅 비어있는 것이나 다름없기 때문에, `sudo apt-get update` 로 설치 가능한 패키지 리스트를 불러온 후, Docker 등 필요한 패키지를 설치해야 합니다. 

- Ubuntu는 apt, CentOS(AWS AMI)는 yum 명령어를 사용합니다. 운영체제에 맞는 명령어를 사용하세요.

### 1) 우분투 시스템 패키지 업데이트

```bash
$ sudo apt-get update
$ curl https://get.docker.com/ | sudo sh  # 도커 설치
```

- 위 명령어가 작동하지 않을 경우?
    
    ### 2) 필요한 패키지 설치
    
    ```bash
    sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    ```
    
    ### 3) Docker의 공식 GPG키를 추가
    
    ```bash
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    ```
    
    ### 4) Docker의 공식 apt 저장소를 추가
    
    ```bash
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    ```
    
    ### 5) Docker 설치
    
    ```bash
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```
    

### 6) Docker 설치 확인하기

- 도커 실행상태 확인

```bash
sudo docker ps
```

- 도커 실행

```
sudo docker compose up
```

### 참고: sudo 없이 docker명령어 사용하기

**1. 현재 사용자를 docker group에 포함**

> sudo usermod -aG docker ${USER}
> 

**2. 터미널 재시작 후 결과 확인(도커가 등록되어 있는지 확인)**

> id -nG
> 

- 실습: 터미널에서 간단한 도커 내부 코드 변경하기
    
    ```bash
    sudo docker exec -it {컨테이너이름} /bin/bash
    
    apt-get update
    apt-get install vim
    vi 파일명
    ```
    

### 포트 오류로 도커 컨테이너 실행 불가시

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%2012.png)

```jsx
$ netstat -ano | findstr :8080
$ taskkill /pid {8080이 실행중인 포트번호} /f

그래도 해결되지 않으면
$ net stop winnat
$ net start winnat
```

![Untitled](Airflow%20688496a7ab874107b4504e070deab79d/Untitled%2013.png)

- 실습. C:\ITStudy\10_kafka\python-kafka\kafka3 폴더 안에 있는 app.py를 주기적으로 호출하도록 하는 airflow dag를 하나 작성해보세요. 같이 일하는 사람들이 알아보기 편하게 decription을 달아서 사용해보세요. 11시 40분까지 조별로. 하기싫으시면 안 하셔도 됩니다.

```jsx
# 7_task_relationship.py

from datetime import datetime, timedelta
from textwrap import dedent

# DAG 객체: 이를 사용하여 DAG를 인스턴스화해야 함
from airflow import DAG

# Operators: 작업을 수행하는 데 필요
from airflow.operators.bash import BashOperator

# 이러한 args는 각 operator의 초기화 중에 작업별로 재정의할 수 있음
default_args = {
    'owner': 'woori-fisa',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=15),
    # 'email': ['atangi@naver.com'],
    # 'email_on_failure': True,
    # 'email_on_retry': False,
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
    # 'wait_for_downstream': False,
    # 'dag': dag,
    # 'sla': timedelta(hours=2),
    # 'execution_timeout': timedelta(seconds=300),
    # 'on_failure_callback': some_function,
    # 'on_success_callback': some_other_function,
    # 'on_retry_callback': another_function,
    # 'sla_miss_callback': yet_another_function,
    # 'trigger_rule': 'all_success'
}
with DAG(
    'task-relationship',
    default_args=default_args,
    description='간단한 튜토리얼 DAG',
    schedule_interval=timedelta(days=1),
    start_date=datetime(2024, 3, 25),
    catchup=False,
    tags=['task-relationship'],
) as dag:

    # t1, t2, t3는 operator를 인스턴스화하여 생성된 작업 예시
    t1 = BashOperator(
        task_id='print_date',
        bash_command='date',
    )

    t2 = BashOperator(
        task_id='sleep',
        depends_on_past=False,
        bash_command='sleep 5',
        retries=3,
    )
    t1.doc_md = dedent(
        """\
    #### 작업 문서화
    `doc_md` (markdown), `doc` (일반 텍스트), `doc_rst`, `doc_json`, `doc_yaml`라는 속성을 사용하여 작업을 문서화할 수 있음
    이는 UI의 Task Instance 세부 정보 페이지에서 렌더링됨.
    """
    )

    dag.doc_md = """
    이는 어디서든지 배치될 수 있는 문서화입니다.
    """  # 그렇지 않으면, 이렇게 작성
    templated_command = dedent(
        """
    {% for i in range(5) %}
        echo "{{ ds }}"
        echo "{{ macros.ds_add(ds, 7)}}"
        echo "{{ params.my_param }}"
    {% endfor %}
    """
    )

    t3 = BashOperator(
        task_id='templated',
        depends_on_past=False,
        bash_command=templated_command,
        params={'my_param': '전달한 매개변수'},
    )

    
    t4 = BashOperator(
        task_id='finished',
        bash_command='echo "finished"'
    )

    # t1 >> [t2, t3] >> t4
    t1 >> t2 >> t4
    t1 >> t3 >> t4
```
